import merge from 'lodash/merge';

import template from './line.html';
import controller from './line.controller';
import mainTemplate from './line-main.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.line', {
    url: '/line/:serviceName',
    views: {
      'telephonyView@telecom.telephony': {
        template,
      },
      'lineView@telecom.telephony.billingAccount.line': {
        template: mainTemplate,
        controller,
        controllerAs: 'LineCtrl',
      },
      'lineInnerView@telecom.telephony.billingAccount.line': {
        templateUrl: 'app/telecom/telephony/line/management/management.html',
        controller: 'TelecomTelephonyLineManagementCtrl',
        controllerAs: 'LineManagementCtrl',
      },
    },
    resolve: {
      currentLine($stateParams, OvhApiTelephony) {
        return OvhApiTelephony.Line()
          .v6()
          .get({
            billingAccount: $stateParams.billingAccount,
            serviceName: $stateParams.serviceName,
          })
          .$promise.then((line) =>
            OvhApiTelephony.Line()
              .v6()
              .simultaneousChannelsDetails({
                billingAccount: $stateParams.billingAccount,
                serviceName: $stateParams.serviceName,
              })
              .$promise.then((details) => details)
              .catch(() => null)
              .then((details) =>
                merge(line, {
                  simultaneousLinesDetails: details || null,
                }),
              ),
          )
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
      lineLink: /* @ngInject */ ($state, $transition$) =>
        $state.href(
          'telecom.telephony.billingAccount.line',
          $transition$.params(),
        ),
      consumptionLink: /* @ngInject */ ($state, $transition$) =>
        $state.href(
          'telecom.telephony.billingAccount.line.consumption',
          $transition$.params(),
        ),
      callsLink: /* @ngInject */ ($state, $transition$) =>
        $state.href(
          'telecom.telephony.billingAccount.line.calls',
          $transition$.params(),
        ),
      tonesLink: /* @ngInject */ ($state, $transition$) =>
        $state.href(
          'telecom.telephony.billingAccount.line.tones',
          $transition$.params(),
        ),
      answerLink: /* @ngInject */ ($state, $transition$) =>
        $state.href(
          'telecom.telephony.billingAccount.line.answer',
          $transition$.params(),
        ),
      phoneLink: /* @ngInject */ ($state, $transition$) =>
        $state.href(
          'telecom.telephony.billingAccount.line.phone',
          $transition$.params(),
        ),
      assistLink: /* @ngInject */ ($state, $transition$) =>
        $state.href(
          'telecom.telephony.billingAccount.line.assist',
          $transition$.params(),
        ),
      contactLink: /* @ngInject */ ($state, $transition$) =>
        $state.href(
          'telecom.telephony.billingAccount.line.contact',
          $transition$.params(),
        ),
      faxLink: /* @ngInject */ ($state, $transition$) =>
        $state.href(
          'telecom.telephony.billingAccount.line.fax',
          $transition$.params(),
        ),
      currentActiveLink: /* @ngInject */ ($state, $transition$) => () =>
        $state.href($state.current.name, $transition$.params()),
    },
  });
};
