export default class WebPaasProjectsCtrl {
  /* @ngInject */
  constructor(WebPaas) {
    this.WebPaas = WebPaas;
    this.WEB_PAAS_ADD = 'web-paas::all-projects::create-project';
  }

  $onInit() {
    this.WEB_PAAS_GOTO_PROJECT = `${this.webPaasProjectsTablePrefix}goto-project`;
    this.WEB_PAAS_GOTO_PSH = `${this.webPaasProjectsTablePrefix}options::goto-project`;
    this.WEB_PAAS_MANAGE_PROJECT = `${this.webPaasProjectsTablePrefix}options::manage-project`;
    this.alerts = {
      list: 'web_paas_dashboard_list',
    };
  }

  static getDetailsState(projectId) {
    return `web-paas.dashboard.service({ projectId: '${projectId}'})`;
  }

  static isAdmin(project) {
    return project.getAccountName() === this.user.nichandle;
  }
}
