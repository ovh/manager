import { SMS_COMPOSE } from '../../sms/compose/telecom-sms-sms-compose.constant';
import SMS_CONSTANTS from '../../telecom-sms.constant';

import component from './telecom-sms-batches-create.component';

import contactsChoiceComponent from '../../components/contacts-choice/contacts-choice.component';
import receiversChoiceComponent from '../../components/receivers-choice/receivers-choice.component';
import composeTipComponent from '../../components/sms-tips/compose/sms-tips-compose.component';
import sizeTipComponent from '../../components/sms-tips/size/sms-tips-size.component';

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
      computeBatchPromises: /* @ngInject */ ($q) => (createBatchPromises) =>
        $q.all(createBatchPromises),
      createBatch: /* @ngInject */ ($http, serviceName) => (batchParams) =>
        $http.post(`/sms/${serviceName}/batches`, batchParams),
      onSuccess: /* @ngInject */ ($translate, goBack, TucToast) => () =>
        goBack().then(() => {
          TucToast.success($translate.instant('sms_batches_create_success'));
        }),
      getSendersHref: /* @ngInject */ ($state) => () =>
        $state.href('sms.service.senders'),
      getOrderHref: /* @ngInject */ ($state) => () =>
        $state.href('sms.service.order'),
      goBack: /* @ngInject */ ($state) => () => $state.go('^'),
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
      schema: /* @ngInject */ ($http) =>
        $http.get('/sms.json').then(({ data: schema }) => schema),
      selectedReceivers: /* @ngInject */ ($transition$) =>
        $transition$.params().selectedReceivers,
      senders: /* @ngInject */ ($q, $translate, iceberg, serviceName) =>
        iceberg(`/sms/${serviceName}/senders`)
          .query()
          .expand('CachedObjectList-Pages')
          .execute()
          .$promise.then(({ data }) => data)
          .then((sendersDetails) =>
            sendersDetails.map((sender) => ({
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
      smsClasses: /* @ngInject */ (schema) =>
        schema.models['sms.ClassEnum'].enum.map((smsClass) => ({
          value: smsClass,
          label: smsClass.replace('_', ' '),
        })),
    },
    translations: {
      value: ['.'],
      format: 'json',
    },
  });

  $stateProvider.state('sms.service.batches.create.receivers-choice', {
    params: {
      model: {},
    },
    resolve: {
      model: /* @ngInject */ ($transition$) => $transition$.params().model,
    },
    views: {
      modal: {
        component: receiversChoiceComponent.name,
      },
    },
    layout: 'modal',
  });

  $stateProvider.state('sms.service.batches.create.phonebooks-contacts', {
    params: {
      model: {},
    },
    resolve: {
      model: /* @ngInject */ ($transition$) => $transition$.params().model,
      getPhonebookContacts: /* @ngInject */ (iceberg, serviceName) => (
        bookKey,
      ) =>
        iceberg(`/sms/${serviceName}/phonebooks/${bookKey}/phonebookContact`)
          .query()
          .expand('CachedObjectList-Pages')
          .execute()
          .$promise.then(({ data }) => data),
    },
    views: {
      modal: {
        component: contactsChoiceComponent.name,
      },
    },
    layout: 'modal',
  });

  $stateProvider.state('sms.service.batches.create.compose-tips', {
    resolve: {
      close: /* @ngInject */ (goBack) => goBack,
    },
    views: {
      modal: {
        component: composeTipComponent.name,
      },
    },
    layout: 'modal',
    translations: {
      value: ['../../sms/compose'],
      format: 'json',
    },
  });

  $stateProvider.state('sms.service.batches.create.size-tips', {
    resolve: {
      close: /* @ngInject */ (goBack) => goBack,
    },
    views: {
      modal: {
        component: sizeTipComponent.name,
      },
    },
    layout: 'modal',
    translations: {
      value: ['../../sms/compose'],
      format: 'json',
    },
  });
};
