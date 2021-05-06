import { API_GUIDES } from './order-command.constants';

export default class {
  $onInit() {
    this.apiGuideUrl =
      API_GUIDES[this.user.ovhSubsidiary] || API_GUIDES.DEFAULT;
  }

  getRequestData() {
    return JSON.stringify(this.orderData, undefined, 4);
  }

  getOrderAPIUrl() {
    return `POST /cloud/project/${this.projectId}/database/${this.engine}`;
  }
}
