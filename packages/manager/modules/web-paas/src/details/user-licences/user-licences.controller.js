export default class {
  /* @ngInject */
  $onInit() {
    this.alerts = {
      licences: 'web_paas_licences_alert',
    };
  }

  canInviteUser() {
    return this.userList.length < this.project.getTotalLicences();
  }
}
