import capitalize from 'lodash/capitalize';
import { SHELL_NAMES } from '../../databases.constants';

export default class {
  /* @ngInject */
  constructor(
    $translate,
    CucCloudMessage,
    ovhManagerRegionService,
    DatabaseService,
    CucControllerHelper,
  ) {
    this.$translate = $translate;
    this.capitalize = capitalize;
    this.CucCloudMessage = CucCloudMessage;
    this.ovhManagerRegionService = ovhManagerRegionService;
    this.DatabaseService = DatabaseService;
    this.CucControllerHelper = CucControllerHelper;
  }

  $onInit() {
    this.messageContainer =
      'pci.projects.project.storages.databases.dashboard.general-information';
    this.loadMessages();
    this.connectionInformation = this.getConnectionInformation();
    this.pollDatabaseStatus();
  }

  getConnectionInformation() {
    const nodesConfig = this.database.nodes.map((node) => node.name).join(',');
    return {
      mongoShell: `${SHELL_NAMES[this.database.engine]} --tls --host ${
        this.database.nodes.length > 1 ? 'replicaset/' : ''
      }${nodesConfig} --authenticationDatabase admin --username <username> --password <password>`,
      application: `${
        this.database.engine
      }://<username>:<password>@${nodesConfig}/admin?${
        this.database.nodes.length > 1 ? 'replicaSet=replicaset&' : ''
      }tls=true`,
    };
  }

  downloadCertificate() {
    this.trackDashboard('general_information::download_certificate');
    this.CucControllerHelper.constructor.downloadContent({
      fileContent: this.database.certificate.ca,
      fileName: `ca.pem`,
    });
  }

  showCertificate() {
    this.CucCloudMessage.info(
      {
        textHtml: this.$translate.instant(
          'pci_databases_general_information_certificate_tooltip',
          {
            certificate: this.database.certificate.ca,
          },
        ),
      },
      this.messageContainer,
    );
  }

  addNode() {
    this.trackDashboard('general_information::add_node');
    this.goToAddNode();
  }

  deleteNode() {
    this.trackDashboard('general_information::remove_node');
    this.goToDeleteNode();
  }

  manageUsers() {
    if (this.users.length === 0 && this.allowedIps.length === 0) {
      this.trackDashboard('general_information::no_user_ip_banner_manage_user');
    } else if (this.users.length === 0) {
      this.tracktrackDashboardDatabases(
        'general_information::no_user_banner_manage_user',
      );
    } else {
      this.trackDashboard('general_information::manage_user');
    }

    this.goToManagerUsers();
  }

  manageVRack() {
    this.trackDashboard('general_information::goto_vrack');
  }

  manageAllowedIps() {
    this.trackDashboard('allowed-ips::options::manage_ips');
    this.goToAllowedIPs();
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

  upgradeVersion() {
    this.trackDashboard('general_information::upgrade_version');
    this.goToUpgradeVersion();
  }

  upgradePlan() {
    this.trackDashboard('general_information::upgrade_plan');
    this.goToUpgradePlan();
  }

  upgradeNode() {
    this.trackDashboard('general_information::upgrade_node');
    this.goToUpgradeNode();
  }

  deleteDatabase() {
    this.trackDashboard('general_information::delete_database');
    this.goToDeleteDatabase();
  }

  $onDestroy() {
    this.stopPollingDatabaseStatus();
    this.stopPollingNodesStatus();
  }
}
