mainApp.directive('ngGallery', function() {
        return {
            restrict: 'E',
            scope: {
                name: '@',
                label: '@',
                images: '=',
                link: '=',
                isChange: '&',
                notRemove: '=',
                maxFiles: '@'
            },
            controller:['$scope', 'alertSvc', 'CONSTANTS', 'BASE_URL', 'modalSvc', '$translate', '$q', '$filter',
              function ($scope, alertSvc, CONSTANTS, BASE_URL, modalSvc, $translate, $q, $filter) {
                $translate.onReady(function() {
                  $scope.titleImg = $translate.instant('VAL_ITEM_GALLERY');
                });
                $scope.maxFileUpload = CONSTANTS.maxFileUpload;
                $scope.path = BASE_URL.api + '/v1/common/viewFile?file=';
                $scope.size = CONSTANTS.files['gallery'];
                $scope.notAdd = false;

                $scope.loadObject = function() {
                  var inputGal = "imgGallery";
                  var dropZoneId = "drop-zone";
                  var dropZone = $("#"+dropZoneId);
                  var ooleft = dropZone.offset().pageX;
                  var ooright = dropZone.outerWidth() + ooleft;
                  var ootop = dropZone.offset().pageY;
                  var oobottom = dropZone.outerHeight() + ootop;
                  var mouseOverClass = "mouse-over";
                  $scope.notAdd = ($scope.images.length>=$scope.maxFiles)?true:false;

                  var inputFile = document.getElementById(inputGal);
                  inputFile.addEventListener('change', function(event) {
                    $scope.imagesPreview(this);
                  });

                  document.getElementById(dropZoneId).addEventListener('dragover', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    dropZone.addClass(mouseOverClass);
                    $('#'+inputGal).show();
                  }, true);

                  document.getElementById(dropZoneId).addEventListener("drop", function (e) {
                    dropZone.removeClass(mouseOverClass);
                    $('#'+inputGal).hide();
                  }, true);
                }

                $scope.imagesPreview = function(input) {
                  var placeToInsertImagePreview = '.gallery-preview';
                  if (input.files) {
                    var onlyVisible = $scope.images.length - ($filter('filter')($scope.images, {action: 3})).length;
                    var availableMax = (input.files.length > $scope.maxFiles-onlyVisible)?$scope.maxFiles-onlyVisible:input.files.length;
                    var idx = 0;
                    for (i = 0; i < availableMax; i++) {
                      var reader = new FileReader();
                      reader.onload = function(event) {
                        angular.forEach($scope.images, function(item, key){
                          if (item.idx==idx) {
                            item.image = event.target.result;
                            item.idx = -1;
                          }
                        });
                        idx++;
                      }
                      $scope.images.push({
                        "id": 0,
                        "idx": i,
                        "file": input.files[i],
                        "label": $scope.titleImg.format(onlyVisible+1),
                        "action": 1 //add
                      });
                      reader.readAsDataURL(input.files[i]);
                    }
                    if (onlyVisible+availableMax>=$scope.maxFiles) $scope.notAdd = true;
                  }
                };

                $scope.removeItem = function(idx) {
                  if ($scope.notRemove && $scope.images[idx].action==0) {
                    alertSvc.showAlertByCode(217);
                  }
                  else {
                    modalSvc.showModal({
                      size: 'sm'
                    },{
                      closeButtonText: $translate.instant('BTN_NO'),
                      actionButtonText: $translate.instant('BTN_YES'),
                      bodyText: $translate.instant('MSG_REMOVE_IMAGE')
                    }).then(function (result) {
                      if ($scope.images[idx].action==0) {
                        $scope.images[idx].action = 3; //remove
                        $scope.isChange();
                      }
                      else {
                        $('#itemGallery'+idx).remove();
                        $scope.images.splice(idx, 1);
                      }
                      $scope.notAdd = ($scope.images.length < $scope.maxFiles)?false:true;
                    });
                  }
                };

                $scope.editTitle = function(idx) {
                  if ($scope.notRemove) {
                    alertSvc.showAlertByCode(217);
                  }
                  else {
                    modalSvc.showModal({
                        templateUrl: '/templates/directives/nggallery/modalChangeTitle.html'
                      },
                      {
                        closeButtonText: undefined,
                        frmItem: {
                          title: $scope.images[idx].label
                        },
                        defer: true,
                        beforeClose: function (scope) {
                          var defered = $q.defer();
                          var promise = defered.promise;
                          if (scope.modalOptions.frmItem.title=='') {
                            alertSvc.showAlertByCode(101);
                            defered.resolve(false);
                          }
                          else {
                            $scope.images[idx].label = scope.modalOptions.frmItem.title;
                            if ($scope.images[idx].action==0) $scope.images[idx].action = 2; //edit
                            $scope.isChange();
                            defered.resolve(true);
                          }
                          return promise;
                        }
                      });
                  }
                };

                $scope.viewLarge = function(idx) {
                  let item = $scope.images[idx];
                  if (item.action==1) {
                    modalSvc.showModalWithBase64(item.image);
                  }
                  else {
                    modalSvc.showModalWithFile($scope.path+item.image+'&size=large&type=gallery');
                  }
                }

              }
            ],
            compile: function() {
              return {
                pre: function(scope, element, attrs) {
                  if (attrs.isChange==undefined) scope.isChange = undefined;
                  if (attrs.maxFiles==undefined) scope.maxFiles = 4;
                }
              };
            },
            templateUrl: 'templates/directives/nggallery/nggallery.html'
        };
    });
