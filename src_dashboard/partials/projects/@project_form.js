angular.module('mainApp').controller('projectFormController', ['$scope', 'actionSvc', 'modalSvc', 'mainSvc', '$rootScope', '$stateParams', '$translate', '$q', '$filter', 'BASE_URL', 'alertSvc',
    function ($scope, actionSvc, modalSvc, mainSvc, $rootScope, $stateParams, $translate, $q, $filter, BASE_URL, alertSvc) {
        $scope.paramAction = '';
        $scope.paramId = 0;
        $scope.loadForm = false;
        $scope.saveForm = false;
        $scope.formData = {
          id: 0,
          title: '',
          addressNbr: '',
          addressStreet: '',
          addressCity: '',
          addressZip: '',
          catId: '',
          couId: '',
          staId: '',
          description: '',
          excerpt: '',
          status: ($rootScope.userInfo.role==2)?2:1,
          progress: 1,
          lookingInvestor: 2,
          estimatedAvailability: 0,
          image: undefined,
          gallery: undefined,
          changeStatus: 0,
          etherscanAddress: '',
          maxTokenPurchase: 1
        };
        $scope.formMetaData = [
          {},
          { //1 - Properties
            highlights: {
              id: 0,
              proId: 0,
              needRemodelation: false,
              assetAnnualReturn: undefined,
              assetRenovationTargetYield: undefined,
              assetRentStartDate: undefined,
              setupFee: undefined,
              assetTicketPrice: undefined,
              assetTotalTokens: undefined,
              assetPropertyType: 1, //multi family
              assetConstructionYear: new Date().getFullYear(),
              assetNeighborhood: undefined,
              assetSquareFeet: undefined,
              assetLandSquareFeet: undefined,
              assetTotalUnits: undefined,
              assetBedroomBath: undefined,
              assetHasTenants: 1, //fully rented
              assetSection8: 1, //no
              gpsLatitude: '',
              gpsLongitude: ''
            },
            financials: {
              id: 0,
              proId: 0,
              grossRentAnual: undefined,
              grossRent: undefined,
              lotClossingCost: 0,
              brokerComission: 0,
              clossingCost: 0,
              successFee: 0,
              propertyTaxes: 0,
              propertyInsurance: 0,
              propertyUtilities: 1, //tenant paid
              salePrice: undefined,
              netProfit: undefined,
              assetPrice: 0,
              underlyingAssetPrice: 0,
              platformListingFee: 0,
              accountantFees: 0,
              lotClossingCost: 0
            }
          }
        ];
        $scope.lstItemsGallery = [];
        $scope.editForm = false;
        $scope.lstCategories = [];
        $scope.lstCountry = [];
        $scope.lstState = [];
        $scope.lstDeals = [];
        $scope.lstMentors = [];
        $scope.path = BASE_URL.api + '/v1/common/viewFile?type=profile&file=';
        $scope.isActive = false;
        $scope.imageNew = null;
        $scope.templateMeta = undefined;

        $scope.loadFormProject = function() {
          $scope.paramAction = $stateParams.action;
          $scope.paramId = $stateParams.id;

          $translate.onReady(function() {
            $scope.lstProgress = [
              {id: 1, label: $translate.instant('VAL_COMING_SOON') },
              {id: 2, label: $translate.instant('VAL_PROGRESS') },
              {id: 3, label: $translate.instant('VAL_SOLD_OUT') },
              {id: 4, label: $translate.instant('VAL_READY_SALE') },
              {id: 5, label: $translate.instant('VAL_SALED') }
            ];
            $scope.lstStatus =
            ($rootScope.userInfo.role==2)?[
              {id: 2, label: $translate.instant('VAL_PENDING') },
              {id: 3, label: $translate.instant('VAL_ACTIVE') },
              {id: 4, label: $translate.instant('VAL_REJECTED') }
            ]:[
              {id: 1, label: $translate.instant('VAL_DRAFT') },
              {id: 2, label: $translate.instant('VAL_PENDING') },
              {id: 3, label: $translate.instant('VAL_ACTIVE') },
              {id: 4, label: $translate.instant('VAL_REJECTED') }
            ];
            $scope.lstPropertyType = [
              {id: 1, label: $translate.instant('VAL_MULTI_FAMILY') },
              {id: 2, label: $translate.instant('VAL_SINGLE_FAMILY') }
            ];
            $scope.lstHasTenants = [
              {id: 1, label: $translate.instant('VAL_FULLY_RENTED') },
              {id: 2, label: $translate.instant('VAL_FOR_SALE') }
            ];
            $scope.lstMontlyUtilities = [
              {id: 1, label: $translate.instant('VAL_TENANT_PAID') }
            ];
            $scope.msgInvalid = $translate.instant('MSG_INVALID_INPUT');
          });

          /* Load Data */
          if (($scope.paramAction=="view" || $scope.paramAction=="edit") && $scope.paramId) {
            mainSvc.callService({
                url: 'project/getproject',
                params: {
                  'usrId': $rootScope.userInfo.id,
                  'proId': $scope.paramId
                }
            }).then(function (response) {
              $scope.formData = angular.copy(response);
              $scope.formData.changeStatus = 0;
              $scope.isActive = ($scope.formData.status==3 && $rootScope.userInfo.role!=2)?true:false;
              if ($scope.formData.status==4) $scope.formData.status=1;
              if ($scope.formData.gallery) $scope.lstItemsGallery = JSON.parse($scope.formData.gallery);
              $scope.changeCategory();

              //Load Partners
              mainSvc.callService({
                  url: 'project/getPartners',
                  params: {
                    'usrId': $rootScope.userInfo.id,
                    'proId': $scope.paramId
                  }
              }).then(function (response) {
                $scope.lstMentors = angular.copy(response);
              });
              if ($scope.formData.progress==3) {
                //Load Deals
                mainSvc.callService({
                    url: 'project/getDeals',
                    params: {
                      'usrId': $rootScope.userInfo.id,
                      'proId': $scope.paramId
                    }
                }).then(function (response) {
                  $scope.lstDeals = angular.copy(response);
                  $scope.initTextarea();
                });
              }
              else {
                $scope.initTextarea();
              }

              //Load Meta Data
              if ($scope.formData.catId==1) {
                mainSvc.callService({
                    url: 'project/getMetaProperties',
                    params: {
                      'usrId': $rootScope.userInfo.id,
                      'proId': $scope.paramId
                    }
                }).then(function (response) {
                  $scope.formMetaData[1].highlights = JSON.parse(angular.copy(response.highlights))[0];
                  $scope.formMetaData[1].financials = JSON.parse(angular.copy(response.financials))[0];
                  $scope.formMetaData[1].highlights.needRemodelation=($scope.formMetaData[1].highlights.needRemodelationINT)?true:false;
                });
              };

              if (!$scope.isActive) loadCombos(true);
              else $scope.loadForm = true;
            });
          }
          else {
            $scope.formData.changeStatus = 1;
            loadCombos(false);
            $scope.initTextarea();
          };
        }

        var loadCombos = function(loadState) {
          /* Load combos */
          mainSvc.callService({
              url: 'common/getlistcategories'
          }).then(function (response) {
            $scope.lstCategories = angular.copy(response);

            mainSvc.callService({
                url: 'common/getListCountriesUsa',
                secured: false
            }).then(function (response) {
              $scope.lstCountry = angular.copy(response);
              if (loadState) $scope.selectCountry(false);
              $scope.loadForm = true;
            });
          });
        };

        $scope.initTextarea = function() {
          // Material Select Initialization
          $(document).ready(function() {
            tinymce.remove();
            tinymce.init(Object.assign({
              height: '540'
            }, _tinyMCEDefault, {
              selector: 'textarea.textHtml',
              setup: function(ed) {
                   ed.on('change', function(e) {
                      var $scope = angular.element(document.querySelector('[ng-controller=projectFormController]')).scope();
                      $scope.isEditingForm();
                      $scope.formData.description = ed.getContent();
                      $scope.$apply()
                   });
              }
            }));
          });
        }

        $scope.changeStatus = function() {
          $scope.formData.changeStatus = 1;
          $scope.isEditingForm();
        }

        $scope.selectCountry = function (clickEvent) {
          if ($scope.formData.couId) {
            mainSvc.callService({
                url: 'common/getListStates',
                params: {
                  couId: $scope.formData.couId
                }
            }).then(function (response) {
              $scope.lstState = angular.copy(response);
              if (clickEvent) $scope.isEditingForm();
            });
          }
        }

        $scope.clickRemove = function() {
          modalSvc.showModal({
            size: 'sm'
          },{
            closeButtonText: $translate.instant('BTN_NO'),
            actionButtonText: $translate.instant('BTN_YES'),
            bodyText: $translate.instant('MSG_REMOVE_ACTION', { name: $scope.formData.title})
          }).then(function (result) {
            mainSvc.callService({
                url: 'project/removeproject',
                params: {
                  'usrId': $rootScope.userInfo.id,
                  'proId': $scope.paramId
                }
            }).then(function (response) {
              actionSvc.goToAction(10); //list projects
              alertSvc.showAlertByCode(4);
            });
          });
        };

        $scope.isEditingForm = function () {
            if (!$scope.editForm) $scope.editForm = true;
        }

        $scope.clickViewDetail = function() {
          actionSvc.goToSite(105, {id: $scope.paramId}, true); //view project
        };

        $scope.saveFormByStatus = function(idStatus) {
          if ($scope.formData.status==1 && idStatus==2) $scope.formData.changeStatus = 1;
          $scope.formData.status = idStatus;
          $scope.submitForm();
        };

        $scope.submitForm = function() {
          if (!$scope.frmProject.$invalid) {
            $('#frmProject').removeClass('was-validated');
            //Validations
            if (!$scope.isActive) {
              if (
                  $scope.formData.catId==0 ||
                  $scope.formData.couId==0 ||
                  $scope.formData.staId==0 ||
                  $scope.formData.maxTokenPurchase==0
                  ) {
                alertSvc.showAlertByCode(101);
                return false;
              }
              if (!$scope.imageNew && !$scope.formData.image) {
                alertSvc.showAlertByCode(109);
                return false;
              }
            }
            else {
              if ($scope.formData.progress==0) {
                alertSvc.showAlertByCode(101);
                return false;
              }
            }
            var arrLstDeals = [];
            var arrLstMentors = [];
            angular.forEach($scope.lstDeals, function(item, key){
              arrLstDeals.push({
                id: (item.id>=0)?item.id:0,
                title: item.title,
                description: item.description,
                money: item.money,
                action: item.action
              });
            });
            angular.forEach($scope.lstMentors, function(item, key){
              arrLstMentors.push({
                id: (item.id>=1)?item.id:0,
                partner: item.partner,
                message: item.message,
                accepted: item.accepted,
                order: item.order,
                action: item.action
              });
            });
            //Ajax send
            var arrFilesUpload = [];
            if ($scope.imageNew) arrFilesUpload.push($scope.imageNew);
            if ($scope.formData.estimatedAvailability==undefined) $scope.formData.estimatedAvailability=0;
            $scope.saveForm = true;
            $scope.editForm = false;
            alertSvc.showAlertByCode(108);
            mainSvc.callService({
                url: (!$scope.isActive)?(($scope.paramAction=='new')?'project/insertproject':'project/updateproject'):'project/updateProjectActive',
                data: {
                    'fields': (!$scope.isActive)?{
                      'usrId': $rootScope.userInfo.id,
                      'proId': ($scope.paramAction=='new')?0:$scope.paramId,
                      'title': $scope.formData.title,
                      'addressNbr': $scope.formData.addressNbr,
                      'addressStreet': $scope.formData.addressStreet,
                      'addressCity': $scope.formData.addressCity,
                      'addressZip': $scope.formData.addressZip,
                      'catId': $scope.formData.catId,
                      'couId': $scope.formData.couId,
                      'staId': $scope.formData.staId,
                      'description': encodeURIComponent($scope.formData.description),
                      'excerpt': $scope.formData.excerpt,
                      'status': $scope.formData.status,
                      'progress': $scope.formData.progress,
                      'lookingInvestor': $scope.formData.lookingInvestor,
                      'estimatedAvailability': $scope.formData.estimatedAvailability,
                      'image': $scope.formData.image,
                      'changeStatus': $scope.formData.changeStatus,
                      'arrDeals': (arrLstDeals.length>0)?JSON.stringify(arrLstDeals):'',
                      'arrMentors': (arrLstMentors.length>0)?JSON.stringify(arrLstMentors):'',
                      'etherscanAddress': $scope.formData.etherscanAddress,
                      'maxTokenPurchase': $scope.formData.maxTokenPurchase
                    }:{
                      'usrId': $rootScope.userInfo.id,
                      'proId': $scope.paramId,
                      'id': $scope.formData.updId,
                      'progress': $scope.formData.progress,
                      'lookingInvestor': $scope.formData.lookingInvestor,
                      'estimatedAvailability': $scope.formData.estimatedAvailability,
                      'description': encodeURIComponent($scope.formData.description),
                      'image': $scope.formData.image,
                      'arrDeals': (arrLstDeals.length>0)?JSON.stringify(arrLstDeals):'',
                      'arrMentors': (arrLstMentors.length>0)?JSON.stringify(arrLstMentors):''
                    },
                    'files': arrFilesUpload
                }
            }).then(function (response) {
              if (response.code==0 || response.code==215) {
                let _proId = response.proId;
                let _updId = response.updId;

                //Save meta data
                if (_proId > 0) {
                  let urlMeta = '';
                  let paramsMeta = undefined;
                  switch ($scope.formData.catId) {
                    case 1:
                      urlMeta = 'project/saveMetaProperties';
                      paramsMeta = Object.assign({}, {
                        'usrId': $rootScope.userInfo.id,
                        'proId': _proId
                      }, $scope.formMetaData[$scope.formData.catId]);
                      break;
                  }
                  if (urlMeta) saveMetaProperties(urlMeta, paramsMeta);
                };

                //Save gallery
                arrFilesUpload = [];
                var arrItemGallery = [];
                angular.forEach($scope.lstItemsGallery, function(objItem, key){
                  if (objItem.action>0) {
                    arrItemGallery.push({
                      'id': objItem.id,
                      'label': objItem.label,
                      'action': objItem.action
                    });
                    if (objItem.action==1) arrFilesUpload.push(objItem.file);
                    else {
                      arrItemGallery[arrItemGallery.length-1].image = objItem.image;
                    }
                  }
                });
                if (arrItemGallery.length>0) {
                  mainSvc.callService({
                    url: 'project/updateGallery',
                    data: {
                      'fields': {
                        'usrId': $rootScope.userInfo.id,
                        'proId': _proId,
                        'updId': _updId,
                        'arrItemGallery': (arrItemGallery.length>0)?JSON.stringify(arrItemGallery):''
                      },
                      'files': arrFilesUpload
                    }
                  }).then(function (response2) {
                    if (response2.code==0) {
                      actionSvc.goToAction(10); //list projects
                      alertSvc.showAlertByCode((response2.code==0)?1:response2.code);
                    }
                  });
                }
                else {
                  actionSvc.goToAction(10); //list projects
                  alertSvc.showAlertByCode((response.code==0)?1:response.code);
                };
              }
              else {
                alertSvc.showAlertByCode(response.code);
              }
            });
          }
          else {
            $('#frmProject').addClass('was-validated');
            $scope.invalidForm = true;
            alertSvc.showAlertByCode(103);
          }
        }

        var saveMetaProperties = function(_url, _params) {
          mainSvc.callService({
            url: _url,
            params: _params
          });
        };

        $scope.clickCancelForm = function() {
          if ($scope.editForm) {
            modalSvc.showModal({
              size: 'sm'
            },{
              closeButtonText: $translate.instant('BTN_NO'),
              actionButtonText: $translate.instant('BTN_YES'),
              bodyText: $translate.instant('MSG_CANCEL_ACTION')
            }).then(function (result) {
              actionSvc.goToAction(10); //list projects
            });
          }
          else {
            actionSvc.goToAction(10); //list projects
          }
        }

        $scope.clickEditDeal = function(item) {
          modalSvc.showModal({
                  templateUrl: '/templates/modals/modalNewDeal.html',
                  size: 'lg'
              },
              {
                  closeButtonText: undefined,
                  formDataDeal: angular.copy(item),
                  edit: true,
                  defer: true,
                  beforeClose: function (scope) {
                    var defered = $q.defer();
                    var promise = defered.promise;

                    if (!scope.frmDeal.$invalid) {
                      $('#frmDeal').removeClass('was-validated');
                      item.title = scope.modalOptions.formDataDeal.title;
                      item.description = scope.modalOptions.formDataDeal.description;
                      item.money = scope.modalOptions.formDataDeal.money;
                      item.action = (item.action==1)?1:2;
                      $scope.isEditingForm();
                      defered.resolve(true);
                    }
                    else {
                      $('#frmDeal').addClass('was-validated');
                      scope.invalidForm = true;
                      alertSvc.showAlertByCode(103);
                      defered.resolve(false);
                    };
                    return promise;
                  }
              });
        }

        $scope.clickRemoveDeal = function(item) {
          modalSvc.showModal({
            size: 'sm'
          },{
            closeButtonText: $translate.instant('BTN_NO'),
            actionButtonText: $translate.instant('BTN_YES'),
            bodyText: $translate.instant('MSG_REMOVE_ACTION', { name: item.title})
          }).then(function (result) {
            if (item.action==1) {
              let index = $scope.lstDeals.findIndex( record => record.id == item.id );
              $scope.lstDeals.splice(index, 1);
            }
            else {
              item.action = 3;
            }
            $scope.isEditingForm();
          });
        }

        $scope.filterNotRemoved = function (item) {
            return item.action != 3;
        };

        $scope.newDeal = function() {
            modalSvc.showModal({
                    templateUrl: '/templates/modals/modalNewDeal.html',
                    size: 'lg'
                },
                {
                    closeButtonText: undefined,
                    formDataDeal: {
                      title: '',
                      description: '',
                      money: '',
                      purchase: 0
                    },
                    edit: false,
                    defer: true,
                    beforeClose: function (scope) {
                      var defered = $q.defer();
                      var promise = defered.promise;

                      if (!scope.frmDeal.$invalid) {
                        $('#frmDeal').removeClass('was-validated');
                        $scope.lstDeals.push(
                        {
                          id: Math.random(),
                          title: scope.modalOptions.formDataDeal.title,
                          description: scope.modalOptions.formDataDeal.description,
                          money: scope.modalOptions.formDataDeal.money,
                          purchase: scope.modalOptions.formDataDeal.purchase,
                          action: 1
                        });
                        $scope.isEditingForm();
                        defered.resolve(true);
                      }
                      else {
                        $('#frmDeal').addClass('was-validated');
                        scope.invalidForm = true;
                        alertSvc.showAlertByCode(103);
                        defered.resolve(false);
                      };
                      return promise;
                    }
                });
        };

        $scope.newPartner = function() {
          if ($scope.lstMentors.length==5) {
            alertSvc.showAlertByCode(211);
          }
          else {
            modalSvc.showModal({
                    templateUrl: '/templates/modals/modalNewPartner.html',
                    size: 'md'
                },
                {
                    closeButtonText: undefined,
                    frmDataPartner: {
                      partner: '',
                      message: ''
                    },
                    defer: true,
                    afterOpen: function (scope) {
                      mainSvc.callService({
                          url: 'common/getListMentors',
                          secured: false
                      }).then(function (response) {
                        $scope.lstCompanies = angular.copy(response);
                        var arrFilter = [];
                        var index = -1;
                        angular.forEach($scope.lstCompanies, function(item, key){
                          index = $scope.lstMentors.findIndex( record => record.partner == item.label );
                          if (index<0) arrFilter.push(item);
                        });
                        renderAutoCompleteCompany('#txtPartner', arrFilter, BASE_URL.api);
                      });
                    },
                    beforeClose: function (scope) {
                      var defered = $q.defer();
                      var promise = defered.promise;
                      var existItem = false;

                      if (!scope.frmPartner.$invalid) {
                        angular.forEach($scope.lstMentors, function(item, key){
                          if (item.partner==$("#txtPartner").val()) existItem = true;
                        });
                        if (existItem) {
                          alertSvc.showAlertByCode(212);
                          defered.resolve(false);
                        }
                        else {
                          var imgAvatar = null;
                          existItem = false;
                          angular.forEach($scope.lstCompanies, function(item, key){
                            if (item.label==$("#txtPartner").val()) {
                              imgAvatar = item.avatar;
                              existItem = true;
                            }
                          });
                          if (!existItem && $("#txtPartner").val().indexOf('@')<0) {
                            alertSvc.showAlertByCode(213);
                            defered.resolve(false);
                          }
                          else {
                            $('#frmPartner').removeClass('was-validated');
                            $scope.lstMentors.push(
                            {
                              id: Math.random(),
                              avatar: imgAvatar,
                              partner: $("#txtPartner").val(),
                              message: scope.modalOptions.frmDataPartner.message,
                              accepted: 1,
                              order: ($scope.lstMentors.length==0)?1:$scope.lstMentors.length+1,
                              action: 1
                            });
                            $scope.isEditingForm();
                            defered.resolve(true);
                          }
                        }
                      }
                      else {
                        $('#frmPartner').addClass('was-validated');
                        scope.invalidForm = true;
                        alertSvc.showAlertByCode(103);
                        defered.resolve(false);
                      };

                      return promise;
                    }
                });
            }
        }

        $scope.clickRemoveMentor = function(item) {
          modalSvc.showModal({
            size: 'sm'
          },{
            closeButtonText: $translate.instant('BTN_NO'),
            actionButtonText: $translate.instant('BTN_YES'),
            bodyText: $translate.instant(((item.accepted==1)?'MSG_REMOVE_ACTION':'MSG_REMOVE_MENTOR_ACTION'), { name: item.partner})
          }).then(function (result) {
            if (item.action==1) {
              let index = $scope.lstMentors.findIndex( record => record.id == item.id );
              $scope.lstMentors.splice(index, 1);
            }
            else {
              item.action = 3;
            }
            $scope.isEditingForm();
          });
        }

        $scope.clickOrderUp = function(item) {
          let index = $scope.lstMentors.findIndex( record => record.id == item.id );
          if (index>0 && $scope.lstMentors[index].action!=3 && $scope.lstMentors[index-1].action!=3) {
            var orderTemp = $scope.lstMentors[index-1].order;
            $scope.lstMentors[index-1].order = orderTemp + 1;
            if ($scope.lstMentors[index-1].action==0) $scope.lstMentors[index-1].action = 4; //change order
            $scope.lstMentors[index].order = orderTemp;
            if ($scope.lstMentors[index].action==0) $scope.lstMentors[index].action = 4; //change order
            $scope.lstMentors = $filter('orderBy')($scope.lstMentors, 'order', false);
            $scope.isEditingForm();
          }
        }

        $scope.clickOrderDown = function(item) {
          let index = $scope.lstMentors.findIndex( record => record.id == item.id );
          if (index<$scope.lstMentors.length-1 && $scope.lstMentors[index].action!=3 && $scope.lstMentors[index+1].action!=3) {
            var orderTemp = $scope.lstMentors[index].order;
            $scope.lstMentors[index].order = orderTemp + 1;
            if ($scope.lstMentors[index].action==0) $scope.lstMentors[index].action = 4; //change order
            $scope.lstMentors[index+1].order = orderTemp;
            if ($scope.lstMentors[index+1].action==0) $scope.lstMentors[index+1].action = 4; //change order
            $scope.lstMentors = $filter('orderBy')($scope.lstMentors, 'order', false);
            $scope.isEditingForm();
          }
        }

        $scope.clickSendMailPartner = function(item) {
          modalSvc.showModal({
            size: 'sm'
          },{
            closeButtonText: $translate.instant('BTN_NO'),
            actionButtonText: $translate.instant('BTN_YES'),
            bodyText: $translate.instant('MSG_CONFIRM_ACTION')
          }).then(function (result) {
            mainSvc.callService({
                url: 'project/sendMailPartnerAgain',
                params: {
                  prpId: item.id
                }
            }).then(function (response) {
              alertSvc.showAlertByCode(1);
            });
          });
        };

        $scope.changeCategory = function() {
          switch ($scope.formData.catId) {
            case 1:
              $scope.templateMeta = 'templates/partials/projects/meta/properties.html';
              break;
          }
        };

        $scope.propertyUtilitiesSum = function() {
          let total = 0;
          total += parseInt(($scope.formMetaData[$scope.formData.catId].financials.brokerComission)?$scope.formMetaData[$scope.formData.catId].financials.brokerComission:0);
          total += parseInt(($scope.formMetaData[$scope.formData.catId].financials.clossingCost)?$scope.formMetaData[$scope.formData.catId].financials.clossingCost:0);
          total += parseInt(($scope.formMetaData[$scope.formData.catId].financials.successFee)?$scope.formMetaData[$scope.formData.catId].financials.successFee:0);
          $scope.formMetaData[$scope.formData.catId].financials.saleClossingCost = total;
          return total;
        }

        $scope.propertyTotalInvestmentSum = function() {
          let total = 0;
          total += parseInt(($scope.formMetaData[$scope.formData.catId].financials.underlyingAssetPrice)?$scope.formMetaData[$scope.formData.catId].financials.underlyingAssetPrice:0);
          total += parseInt(($scope.formMetaData[$scope.formData.catId].financials.platformListingFee)?$scope.formMetaData[$scope.formData.catId].financials.platformListingFee:0);
          total += parseInt(($scope.formMetaData[$scope.formData.catId].financials.accountantFees)?$scope.formMetaData[$scope.formData.catId].financials.accountantFees:0);
          total += parseInt(($scope.formMetaData[$scope.formData.catId].financials.lotClossingCost)?$scope.formMetaData[$scope.formData.catId].financials.lotClossingCost:0);
          $scope.formMetaData[$scope.formData.catId].financials.assetPrice = total;
          return total;
        }

        $scope.changeGrossRent = function() {
          $scope.formMetaData[$scope.formData.catId].financials.grossRentAnual = 12 * $scope.formMetaData[$scope.formData.catId].financials.grossRent;
          isEditingForm();
        }

        $scope.changeSalePrice = function() {
          $scope.formMetaData[$scope.formData.catId].financials.netProfit = $scope.formMetaData[$scope.formData.catId].financials.salePrice - $scope.formMetaData[$scope.formData.catId].financials.assetPrice - $scope.formMetaData[$scope.formData.catId].financials.saleClossingCost;
          isEditingForm();
        }

    }]);
