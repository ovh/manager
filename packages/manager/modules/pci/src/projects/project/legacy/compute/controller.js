import cloneDeep from 'lodash/cloneDeep';
import forEach from 'lodash/forEach';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import set from 'lodash/set';

import { PCI_ANNOUNCEMENTS } from './constants';

export default class CloudProjectComputeCtrl {
  /* @ngInject */
  constructor(
    $q,
    $scope,
    $state,
    $stateParams,
    $translate,
    $window,
    OvhApiCloudProject,
    CucCloudMessage,
    CloudProjectOrchestrator,
    CucUserPref,
    CucFeatureAvailabilityService,
    OvhApiMe,
  ) {
    this.$q = $q;
    this.$scope = $scope;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.$window = $window;
    this.OvhApiCloudProject = OvhApiCloudProject;
    this.CucCloudMessage = CucCloudMessage;
    this.CloudProjectOrchestrator = CloudProjectOrchestrator;
    this.PCI_ANNOUNCEMENTS = PCI_ANNOUNCEMENTS;
    this.OvhApiMe = OvhApiMe;
    this.CucFeatureAvailabilityService = CucFeatureAvailabilityService;
    this.CucUserPref = CucUserPref;
    this.messages = [];
  }

  $onInit() {
    this.serviceName = this.$stateParams.projectId;
    this.infoMessageDismissed = true;

    this.loadMessage();
    this.init();
  }

  loadMessage() {
    this.CucCloudMessage.unSubscribe('pci.projects.project.legacy.compute');
    this.messageHandler = this.CucCloudMessage.subscribe('pci.projects.project.legacy.compute', { onMessage: () => this.refreshMessage() });
  }

  refreshMessage() {
    this.messages = this.messageHandler.getMessages();
  }

  getRouteContext() {
    if (this.$state.includes('pci.projects.project.legacy')) {
      return 'pci.projects.project.legacy.compute';
    }
    return '';
  }

  init() {
    this.loading = true;
    this.OvhApiMe.v6().get().$promise.then((me) => {
      this.loadAnnouncements(me.ovhSubsidiary);
    }).finally(() => {
      this.loading = false;
    });
  }

  loadAnnouncements(ovhSubsidiary) {
    const areDismissed = [];
    forEach(this.PCI_ANNOUNCEMENTS, (announcement) => {
      const now = moment();
      const afterTheStart = now.isAfter(announcement.messageStart);
      const beforeTheEnd = now.isBefore(announcement.messageEnd);
      if (afterTheStart && beforeTheEnd) {
        areDismissed.push(this.isInfoMessageDismissed(announcement));
      }
    });
    this.$q.all(areDismissed).then((areDismissedMessages) => {
      const messages = map(
        areDismissedMessages,
        announcement => this.augmentMessage(
          announcement,
          ovhSubsidiary,
        ),
      );
      forEach(messages, message => this.CucCloudMessage.info(message));
    });
  }

  augmentMessage(message, ovhSubsidiary) {
    const augmentedMessage = cloneDeep(message);
    augmentedMessage.dismiss = () => {
      this.dismissInfoMessage(message.messageId);
    };
    augmentedMessage.text = this.$translate.instant(message.messageId);
    if (!message.linkURL || isEmpty(message.linkURL)) {
      return augmentedMessage;
    }
    augmentedMessage.link = {};
    augmentedMessage.link.value = message.linkURL[ovhSubsidiary] || message.linkURL.EN;
    if (message.hasLinkText) {
      augmentedMessage.link.text = this.$translate.instant(`${message.messageId}_link`);
    } else {
      augmentedMessage.link.text = this.$translate.instant('cloud_message_pci_no_link');
    }
    return augmentedMessage;
  }

  dismissInfoMessage(messageId) {
    this.CucUserPref.set(messageId, { markedAsRead: new Date() });
  }

  isInfoMessageDismissed(message) {
    return this.CucUserPref.get(message.messageId).then((value) => {
      set(message, 'dismissed', !!(!isEmpty(value) && value.markedAsRead));
      return message;
    });
  }
}
