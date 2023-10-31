mainApp.factory('alertSvc', ['$translate',
  function ($translate) {
      var _publicFunctions = {
        showAlert: showAlert,
        showAlertByCode: showAlertByCode
      };

      // Alerts
			function showAlert() {
				toastr.clear();
				return {
					notifySuccess: function (msg) {
						if (msg) toastr.success(msg);
					},
					notifyError: function (msg) {
						if (msg) toastr.error(msg);
					},
					notifyWarning: function (msg) {
						if (msg) toastr.warning(msg);
					},
					notifyInfo: function (msg) {
						if (msg) toastr.info(msg);
					}
				};
			}

      function showAlertByCode(code) {
        toastr.clear();
        var msg = $translate.instant('MSG_COD'+code);
        if (code >= 0 && code < 100) toastr.success(msg);
        if (code >= 100 && code < 200) toastr.info(msg);
        if (code >= 200 && code < 300) toastr.warning(msg);
        if (code >= 300 && code < 400) toastr.error(msg);
      }

      return _publicFunctions;
  }]);
