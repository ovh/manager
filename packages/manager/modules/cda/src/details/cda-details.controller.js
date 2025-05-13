import get from 'lodash/get';

import { GUIDE_URLS } from './cda.constants';

export default class CdaDetailsCtrl {
  /* @ngInject */
  constructor(
    $stateParams,
    $translate,
    $q,
    CdaService,
    CucCloudMessage,
    OvhApiMe,
    constants,
  ) {
    const self = this;

    self.CdaService = CdaService;
    self.serviceName = '';
    self.messages = [];
    self.constants = constants;

    self.loading = true;

    self.guides = {
      title: $translate.instant('cda_guide_title'),
      list: [
        {
          name: $translate.instant('cda_guide_name'),
        },
      ],
      footer: $translate.instant('cda_guide_footer'),
    };

    self.refreshMessage = function refreshMessage() {
      self.messages = self.messageHandler.getMessages();
    };

    self.loadMessage = function loadMessage() {
      CucCloudMessage.unSubscribe('cda');
      self.messageHandler = CucCloudMessage.subscribe('cda', {
        onMessage: () => self.refreshMessage(),
      });
    };

    self.loadGuides = function loadGuides() {
      return OvhApiMe.v6()
        .get()
        .$promise.then((me) => {
          self.guides.list[0].url = `${GUIDE_URLS.home[me.ovhSubsidiary]}${
            GUIDE_URLS.cda
          }`;
        })
        .catch((error) => {
          CucCloudMessage.error(
            `${$translate.instant('cda_guide_retrieval_error')} ${get(
              error,
              'data.message',
              '',
            )}`,
          );
        });
    };

    function init() {
      self.serviceName = $stateParams.serviceName;

      return $q.all([self.loadMessage(), self.loadGuides()]).finally(() => {
        self.loading = false;
      });
    }

    init();
  }
}
