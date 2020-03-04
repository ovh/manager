import constants from './constants';

export default class ManagerHubUserPanelCtrl {
  /* @ngInject */
  constructor($q, $rootScope, atInternet, OvhApiMe, RedirectionService) {
    this.$q = $q;
    this.$rootScope = $rootScope;
    this.atInternet = atInternet;
    this.OvhApiMe = OvhApiMe;
    this.RedirectionService = RedirectionService;
  }

  $onInit() {
    this.$q
      .when(this.me ? this.me : this.OvhApiMe.v6().get().$promise)
      .then(({ ovhSubsidiary }) => {
        this.hasChatbot = constants.CHATBOT_SUBSIDIARIES.includes(
          ovhSubsidiary,
        );
      });
  }

  openChatbot() {
    this.atInternet.trackClick({
      name: 'hub::sidebar::useful-links::action::chatbot',
      type: 'action',
    });
    this.$rootScope.$emit('ovh-chatbot:open');
  }
}
