import get from 'lodash/get';

angular
  .module('managerApp')
  .controller('CdaDetailsCtrl', function CdaDetailsCtrl(
    $stateParams,
    $translate,
    CdaService,
    CucCloudMessage,
    URLS,
    OvhApiMe,
  ) {
    const self = this;

    self.CdaService = CdaService;
    self.serviceName = '';
    self.messages = [];

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
      CucCloudMessage.unSubscribe('paas.cda');
      self.messageHandler = CucCloudMessage.subscribe('paas.cda', {
        onMessage: () => self.refreshMessage(),
      });
    };

    self.loadGuides = function loadGuides() {
      return OvhApiMe.v6()
        .get()
        .$promise.then((me) => {
          self.guides.list[0].url = `${URLS.guides.home[me.ovhSubsidiary]}${
            URLS.guides.cda
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

      self.loadMessage();
      self.loadGuides();
    }

    init();
  });
