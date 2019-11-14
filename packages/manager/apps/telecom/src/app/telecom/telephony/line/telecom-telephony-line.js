import merge from 'lodash/merge';

angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.line', {
    url: '/line/:serviceName',
    views: {
      'telephonyView@telecom.telephony': {
        templateUrl: 'app/telecom/telephony/line/telecom-telephony-line.html',
      },
      'lineView@telecom.telephony.billingAccount.line': {
        templateUrl:
          'app/telecom/telephony/line/telecom-telephony-line-main.view.html',
        controller: 'TelecomTelephonyLineCtrl',
        controllerAs: 'LineCtrl',
      },
      'lineInnerView@telecom.telephony.billingAccount.line': {
        templateUrl:
          'app/telecom/telephony/line/management/telecom-telephony-line-management.html',
        controller: 'TelecomTelephonyLineManagementCtrl',
        controllerAs: 'LineManagementCtrl',
      },
    },
    translations: {
      value: ['.', './details', './management'],
      format: 'json',
    },
    resolve: {
      currentLine($stateParams, OvhApiTelephony) {
        return OvhApiTelephony.Line()
          .v6()
          .get({
            billingAccount: $stateParams.billingAccount,
            serviceName: $stateParams.serviceName,
          })
          .$promise.then(line => OvhApiTelephony.Line()
            .v6()
            .simultaneousChannelsDetails({
              billingAccount: $stateParams.billingAccount,
              serviceName: $stateParams.serviceName,
            })
            .$promise.then(details => details)
            .catch(() => null)
            .then(details => merge(line, {
              simultaneousLinesDetails: details || null,
            })))
          .catch(() => ({}));
      },
      $title(translations, $stateParams, $translate, currentLine) {
        return $translate.instant(
          'telephony_line_page_title',
          { name: currentLine.description || $stateParams.serviceName },
          null,
          null,
          'escape',
        );
      },
    },
  });
});
