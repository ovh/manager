import _ from 'lodash';

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
    moment,
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
    this.moment = moment;
    this.messages = [];
  }

  $onInit() {
    this.serviceName = this.$stateParams.projectId;
    this.loading = true;
    this.infoMessageDismissed = true;

    this.loadMessage();
    this.init();
  }

  loadMessage() {
    this.CucCloudMessage.unSubscribe('iaas.pci-project.compute');
    this.messageHandler = this.CucCloudMessage.subscribe('iaas.pci-project.compute', { onMessage: () => this.refreshMessage() });
  }

  refreshMessage() {
    this.messages = this.messageHandler.getMessages();
  }

  getRouteContext() {
    if (this.$state.includes('iaas.pci-project')) {
      return 'iaas.pci-project.compute';
    }
    return '';
  }

  init() {
    this.loading = true;

    this.OvhApiMe.v6().get().$promise.then((me) => {
      this.loadAnnouncements(me.ovhSubsidiary);
    });

    return this.shouldRedirectToProjectListView()
      .then((redirect) => {
        this.$scope.redirectToListView = redirect;
      })
      .finally(() => {
        this.loading = false;
      });
  }

  shouldRedirectToProjectListView() {
    if (this.$stateParams.forceLargeProjectDisplay) {
      return this.$q.when(false);
    }

    const hasTooMany = this.$q.all({
      hasTooManyInstances: this.CloudProjectOrchestrator.hasTooManyInstances(
        this.$stateParams.projectId,
      ),
      hasTooManyIps: this.CloudProjectOrchestrator.hasTooManyIps(this.$stateParams.projectId),
    }).then(result => result.hasTooManyInstances || result.hasTooManyIps);

    return this.CucUserPref.get(`cloud_project_${this.serviceName}_overview`).then((params) => {
      if (params && params.hide) {
        return false;
      }
      return hasTooMany;
    });
  }

  loadAnnouncements(ovhSubsidiary) {
    const areDismissed = [];
    _.forEach(this.PCI_ANNOUNCEMENTS, (announcement) => {
      const now = moment();
      const afterTheStart = now.isAfter(announcement.messageStart);
      const beforeTheEnd = now.isBefore(announcement.messageEnd);
      if (afterTheStart && beforeTheEnd) {
        areDismissed.push(this.isInfoMessageDismissed(announcement));
      }
    });
    this.$q.all(areDismissed).then((areDismissedMessages) => {
      const messages = _.map(
        areDismissedMessages,
        announcement => this.augmentMessage(
          announcement,
          ovhSubsidiary,
        ),
      );
      _.forEach(messages, message => this.CucCloudMessage.info(message));
    });
  }

  augmentMessage(message, ovhSubsidiary) {
    const augmentedMessage = _.cloneDeep(message);
    augmentedMessage.dismiss = () => {
      this.dismissInfoMessage(message.messageId);
    };
    augmentedMessage.text = this.$translate.instant(message.messageId);
    if (!message.linkURL || _.isEmpty(message.linkURL)) {
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
      _.set(message, 'dismissed', !!(!_.isEmpty(value) && value.markedAsRead));
      return message;
    });
  }
}
