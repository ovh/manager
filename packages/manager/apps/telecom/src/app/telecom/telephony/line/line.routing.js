import merge from 'lodash/merge';

import template from './line.html';
import controller from './line.controller';
import mainTemplate from './line-main.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.line', {
    url: '/line',
    template: '<div ui-view></div>',
    redirectTo: 'telecom.telephony.billingAccount.services',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('telephony_line_breacrumb'),
    },
  });

  $stateProvider.state('telecom.telephony.billingAccount.line.dashboard', {
    url: '/:serviceName',
    views: {
      'telephonyView@telecom.telephony': {
        template,
      },
      'lineView@telecom.telephony.billingAccount.line.dashboard': {
        template: mainTemplate,
        controller,
        controllerAs: 'LineCtrl',
      },
      'lineInnerView@telecom.telephony.billingAccount.line.dashboard': {
        templateUrl: 'app/telecom/telephony/line/management/management.html',
        controller: 'TelecomTelephonyLineManagementCtrl',
        controllerAs: 'LineManagementCtrl',
      },
    },
    resolve: {
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceName,
      currentLine: /* @ngInject */ (
        $stateParams,
        OvhApiTelephony,
        serviceName,
      ) => {
        return OvhApiTelephony.Line()
          .v6()
          .get({
            billingAccount: $stateParams.billingAccount,
            serviceName,
          })
          .$promise.then((line) =>
            OvhApiTelephony.Line()
              .v6()
              .simultaneousChannelsDetails({
                billingAccount: $stateParams.billingAccount,
                serviceName,
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
      $title: /* @ngInject */ ($translate, currentLine, serviceName) => {
        return $translate.instant(
          'telephony_line_page_title',
          { name: currentLine.description || serviceName },
          null,
          null,
          'escape',
        );
      },
      displayAntihackAlert: /* @ngInject */ (
        $http,
        billingAccount,
        serviceName,
      ) =>
        $http
          .get(`/telephony/${billingAccount}/line/${serviceName}/antihack`)
          .then(({ data }) => data.length > 0)
          .catch(() => false),
      lineLink: /* @ngInject */ ($state, $transition$) =>
        $state.href(
          'telecom.telephony.billingAccount.line.dashboard',
          $transition$.params(),
        ),
      consumptionLink: /* @ngInject */ ($state, $transition$) =>
        $state.href(
          'telecom.telephony.billingAccount.line.dashboard.consumption',
          $transition$.params(),
        ),
      callsLink: /* @ngInject */ ($state, $transition$) =>
        $state.href(
          'telecom.telephony.billingAccount.line.dashboard.calls',
          $transition$.params(),
        ),
      tonesLink: /* @ngInject */ ($state, $transition$) =>
        $state.href(
          'telecom.telephony.billingAccount.line.dashboard.tones',
          $transition$.params(),
        ),
      answerLink: /* @ngInject */ ($state, $transition$) =>
        $state.href(
          'telecom.telephony.billingAccount.line.dashboard.answer',
          $transition$.params(),
        ),
      phoneLink: /* @ngInject */ ($state, $transition$) =>
        $state.href(
          'telecom.telephony.billingAccount.line.dashboard.phone',
          $transition$.params(),
        ),
      orderPhoneLink: /* @ngInject */ ($state, $transition$) =>
        $state.href(
          'telecom.telephony.billingAccount.line.dashboard.phone.order',
          $transition$.params(),
        ),
      softphoneLink: /* @ngInject */ ($state, $transition$) =>
        $state.href(
          'telecom.telephony.billingAccount.line.dashboard.softphone',
          $transition$.params(),
        ),
      assistLink: /* @ngInject */ ($state, $transition$) =>
        $state.href(
          'telecom.telephony.billingAccount.line.dashboard.assist',
          $transition$.params(),
        ),
      contactLink: /* @ngInject */ ($state, $transition$) =>
        $state.href(
          'telecom.telephony.billingAccount.line.dashboard.contact',
          $transition$.params(),
        ),
      faxLink: /* @ngInject */ ($state, $transition$) =>
        $state.href(
          'telecom.telephony.billingAccount.line.dashboard.fax',
          $transition$.params(),
        ),
      filteringLink: /* @ngInject */ ($state, $transition$) =>
        $state.href(
          'telecom.telephony.billingAccount.line.dashboard.calls.filtering',
          $transition$.params(),
        ),
      currentActiveLink: /* @ngInject */ ($state, $transition$) => () =>
        $state.href($state.current.name, $transition$.params()),
      breadcrumb: /* @ngInject */ (serviceName) => serviceName,
      featureAvailability: /* @ngInject */ (ovhFeatureFlipping) =>
        ovhFeatureFlipping.checkFeatureAvailability(['telephony:mgcp-banner']),
      isMgcpBannerAvailable: /* @ngInject */ (featureAvailability) =>
        featureAvailability?.isFeatureAvailable('telephony:mgcp-banner') ||
        false,
    },
  });
};
