import { JOB_MULTIPLY_SIGN } from '../../../training.constants';

export default class JobDashboardGeneralInformationCtrl {
  /* @ngInject */
  constructor(coreURLBuilder, CucCloudMessage) {
    this.CucCloudMessage = CucCloudMessage;
    this.billingUrl = coreURLBuilder.buildURL('dedicated', '#/billing/history');
    this.JOB_MULTIPLY_SIGN = JOB_MULTIPLY_SIGN;
  }

  $onInit() {
    this.messageContainer =
      'pci.projects.project.training.jobs.dashboard.general-information';
    this.loadMessages();
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe(this.messageContainer);
    this.messageHandler = this.CucCloudMessage.subscribe(
      this.messageContainer,
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }
}
