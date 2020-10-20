import { SMS_COMPOSE } from '../../sms/compose/telecom-sms-sms-compose.constant';
import SMS_CONSTANTS from '../../telecom-sms.constant';

import component from './telecom-sms-batches-create.component';

import { MANAGE_CREDITS_HIT } from './telecom-sms-batches-create.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('sms.service.batches.create', {
    url: '/create',
    views: {
      'smsView@sms.service': {
        component: component.name,
      },
    },
    resolve: {
      cancelSelection: /* @ngInject */ ($state) => () =>
        $state.go('sms.service.batches.create'),
      createBatch: /* @ngInject */ ($http, serviceName) => (batchParams) =>
        $http.post(`/sms/${serviceName}/batches`, batchParams),
      onSuccess: /* @ngInject */ ($translate, goBack, TucToast) => () =>
        goBack({ reload: true }).then(() => {
          TucToast.success($translate.instant('sms_batches_create_success'));
        }),
      getSendersHref: /* @ngInject */ ($state) => () =>
        $state.href('sms.service.senders'),
      goToOrder: /* @ngInject */ ($state, trackClick) => () => {
        trackClick(MANAGE_CREDITS_HIT);
        return $state.go('sms.service.order');
      },
      goToComposeTip: /* @ngInject */ ($state) => () =>
        $state.go('sms.service.batches.create.compose-tips'),
      goToPhonebooksContacts: /* @ngInject */ ($state) => (model) =>
        $state.go('sms.service.batches.create.phonebooks-contacts', {
          model,
        }),
      goToReceiversChoice: /* @ngInject */ ($state) => (model) =>
        $state.go('sms.service.batches.create.receivers-choice', {
          model,
        }),
      goToSizeTip: /* @ngInject */ ($state) => () =>
        $state.go('sms.service.batches.create.size-tips'),
      groupBySenderType: /* @ngInject */ ($translate) => (sender) =>
        $translate.instant(
          `sms_sender_optgroup_label_${
            sender.sender === SMS_COMPOSE.shortNumber ? 'virtual' : sender.type
          }`,
        ),
      phonebooks: /* @ngInject */ (iceberg, serviceName) =>
        iceberg(`/sms/${serviceName}/phonebooks`)
          .query()
          .expand('CachedObjectList-Pages')
          .execute()
          .$promise.then(({ data }) => data),
      receivers: /* @ngInject */ (iceberg, serviceName) =>
        iceberg(`/sms/${serviceName}/receivers`)
          .query()
          .expand('CachedObjectList-Pages')
          .execute()
          .$promise.then(({ data }) => data),
      receiversUrl: () => SMS_CONSTANTS.SMS_URL.guides.receivers,
      selectedReceivers: /* @ngInject */ ($transition$) =>
        $transition$.params().selectedReceivers,
      senders: /* @ngInject */ (
        $translate,
        iceberg,
        sendersStatus,
        serviceName,
      ) =>
        iceberg(`/sms/${serviceName}/senders`)
          .query()
          .expand('CachedObjectList-Pages')
          .execute()
          .$promise.then(({ data }) => data)
          .then((sendersDetails) =>
            sendersDetails
              .filter(({ status }) => status === sendersStatus.enable)
              .map((sender) => ({
                ...sender,
                label: sender.sender,
              })),
          )
          .then((sendersDetails) => [
            {
              sender: SMS_COMPOSE.shortNumber,
              label: $translate.instant('sms_sender_option_short_number'),
            },
            ...sendersDetails,
          ]),
      sendersStatus: /* @ngInject */ (schema) =>
        schema.models['sms.StatusSenderEnum'].enum.reduce(
          (constant, status) => ({
            ...constant,
            [status]: status,
          }),
          {},
        ),
      smsClasses: /* @ngInject */ (schema) =>
        schema.models['sms.BatchClassEnum'].enum,
    },
    atInternet: {
      rename: 'sms::service::campaign::create',
    },
  });
};
