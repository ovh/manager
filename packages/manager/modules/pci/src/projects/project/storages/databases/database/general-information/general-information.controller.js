import capitalize from 'lodash/capitalize';
import {
  MAX_IPS_DISPLAY,
  CERTIFICATE_FILENAME,
  DATABASE_TYPES,
  SSL_MODE_REQUIRED,
  SSL_MODE_NA,
  SSL_MODE_SSL_TLS,
} from '../../databases.constants';
import {
  WARNING_MESSAGES,
  KARAPACE_URL,
  TRANSLATION_PREFIX,
} from './general-information.constants';
import isFeatureActivated from '../../features.constants';
import { DISK_TYPE } from '../../../../../../components/project/storages/databases/databases.constants';

export default class {
  /* @ngInject */
  constructor(
    $translate,
    CucCloudMessage,
    ovhManagerRegionService,
    DatabaseService,
    CucControllerHelper,
    coreConfig,
  ) {
    this.$translate = $translate;
    this.capitalize = capitalize;
    this.CucControllerHelper = CucControllerHelper;
    this.CucCloudMessage = CucCloudMessage;
    this.ovhManagerRegionService = ovhManagerRegionService;
    this.DatabaseService = DatabaseService;
    this.DATABASE_TYPES = DATABASE_TYPES;
    this.user = coreConfig.getUser();
  }

  $onInit() {
    this.DATABASE_TYPES = DATABASE_TYPES;
    this.DISK_TYPE = DISK_TYPE;

    this.messageContainer = `pci.projects.project.storages.databases.dashboard.general-information-${this.database.id}`;
    this.loadMessages();
    this.pollDatabaseStatus();
    this.maxAllowedIpsToShow = MAX_IPS_DISPLAY;
    this.warningMessages = WARNING_MESSAGES;
    this.loading = {
      restApi: false,
    };
    if (this.isFeatureActivated('restApi')) {
      this.enableRestApi = this.database.restApi ?? false;
      this.restApiServiceUri = this.database.endpoints?.find(
        (endPoint) => endPoint.component === `${this.database.engine}RestApi`,
      )?.uri;
      this.KARAPACE_URL = KARAPACE_URL;
    }
    [this.endpoint] = this.database.endpoints;

    this.maintenanceTime = this.database.maintenanceTime;
    this.backupTime = this.database.backupTime;
    const { supportLevel } = this.user;
    this.supportLevel = `pci_databases_general_information_support_level_${supportLevel.level}`;
  }

  downloadCertificate() {
    this.trackDashboard('general_information::download_certificate');
    this.CucControllerHelper.constructor.downloadContent({
      fileContent: this.database.certificate.ca,
      fileName: CERTIFICATE_FILENAME,
    });
  }

  addNode() {
    this.trackDashboard('general_information::add_node');
    this.goToAddNode();
  }

  deleteNode() {
    this.trackDashboard('general_information::remove_node');
    this.goToDeleteNode();
  }

  getWarningMessage() {
    const noIp =
      this.isFeatureActivated('allowedIpsTab') && this.allowedIps.length === 0;
    const noUsers =
      this.isFeatureActivated('usersTab') && this.users.length === 0;
    if (noIp && noUsers) {
      return this.warningMessages.noIpNoUserMessage;
    }
    if (noIp) {
      return this.warningMessages.noIpMessage;
    }
    if (noUsers) {
      return this.warningMessages.noUserMessage;
    }
    return null;
  }

  manageUsers() {
    if (this.users.length === 0 && this.allowedIps.length === 0) {
      this.trackDashboard('general_information::no_user_ip_banner_manage_user');
    } else if (this.users.length === 0) {
      this.trackDashboard('general_information::no_user_banner_manage_user');
    } else {
      this.trackDashboard('general_information::manage_user');
    }

    this.goToManagerUsers();
  }

  resetPassword() {
    this.trackDashboard('general_information::reset_password');
    this.DatabaseService.resetUserCredentials(
      this.projectId,
      this.database.engine,
      this.database.id,
      this.users[0].id,
    )
      .then((data) => {
        this.trackDashboard(
          'general_information::reset_password_validated',
          'page',
        );
        this.CucCloudMessage.flushMessages(this.messageContainer);
        this.CucCloudMessage.success(
          {
            textHtml: this.$translate.instant(
              'pci_databases_general_information_reset_password_success',
              {
                user: this.users[0].username,
                password: data.password,
              },
            ),
          },
          this.messageContainer,
        );
      })
      .catch((error) => {
        this.trackDashboard(
          'general_information::reset_password_error',
          'page',
        );
        this.CucCloudMessage.error(
          this.$translate.instant(
            'pci_databases_general_information_reset_password_error',
            {
              user: this.users[0].username,
              message: error.data?.message || null,
            },
          ),
          this.messageContainer,
        );
      });
  }

  trackManageVRack() {
    this.trackDashboard('general_information::goto_vrack');
  }

  manageAllowedIps() {
    this.trackDashboard('general_information::configuration::manage_ips');
    this.goToAllowedIPs();
  }

  manageIntegrations() {
    this.trackDashboard(
      'general_information::configuration::manage_integrations',
    );
    this.goToIntegrations();
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

  upgradeStorage() {
    this.trackDashboard('general_information::upgrade_storage');
    this.goToUpgradeStorage();
  }

  deleteDatabase() {
    this.trackDashboard('general_information::delete_database');
    if (isFeatureActivated('serviceIntegrationTab', this.database.engine)) {
      return this.DatabaseService.getLinkedServices(
        this.projectId,
        this.database.engine,
        this.database.id,
        this.databases,
      ).then((linkedServices) =>
        linkedServices.length > 0
          ? this.goToConfirmDeleteDatabase(linkedServices)
          : this.goToDeleteDatabase(),
      );
    }
    return this.goToDeleteDatabase();
  }

  updateMaintenanceTime() {
    this.trackDashboard('general_information::update_maintenance_time');
    return this.DatabaseService.updateDatabaseEngineProperties(
      this.projectId,
      this.database.engine,
      this.database.id,
      { maintenanceTime: `${this.maintenanceTime}:00` },
    );
  }

  handleMaintenanceTimeSuccess() {
    this.database.updateData({
      maintenanceTime: this.maintenanceTime,
    });
    return this.CucCloudMessage.success(
      this.$translate.instant(
        'pci_databases_general_information_update_maintenance_time_success',
      ),
      this.messageContainer,
    );
  }

  showMaintenanceError() {
    return this.CucCloudMessage.error(
      this.$translate.instant(
        'pci_databases_general_information_update_maintenance_time_error',
      ),
      this.messageContainer,
    );
  }

  updateBackupTime() {
    this.trackDashboard('general_information::update_backup_time');
    return this.DatabaseService.updateDatabaseEngineProperties(
      this.projectId,
      this.database.engine,
      this.database.id,
      { backupTime: `${this.backupTime}:00` },
    );
  }

  handleBackupTimeSuccess() {
    this.database.updateData({
      backupTime: this.backupTime,
    });
    return this.CucCloudMessage.success(
      this.$translate.instant(
        'pci_databases_general_information_update_backup_time_success',
      ),
      this.messageContainer,
    );
  }

  showBackupError() {
    return this.CucCloudMessage.error(
      this.$translate.instant(
        'pci_databases_general_information_update_backup_time_error',
      ),
      this.messageContainer,
    );
  }

  onRestApiStatusChange(enableRestApi) {
    this.trackDashboard(
      enableRestApi
        ? 'general-information::kafka_rest_api_enable'
        : 'general-information::kafka_rest_api_disable',
      'click',
    );
    this.loading.restApi = true;
    return this.DatabaseService.updateDatabaseEngineProperties(
      this.projectId,
      this.database.engine,
      this.database.id,
      { restApi: enableRestApi },
    )
      .then(() => {
        return this.goBacktoGeneralInformation();
      })
      .catch(() => {
        this.enableRestApi = !enableRestApi;
        return this.CucCloudMessage.error(
          this.$translate.instant(
            'pci_databases_general_information_kafka_rest_api_enable_disable_error',
          ),
          this.messageContainer,
        );
      })
      .finally(() => {
        this.loading.restApi = false;
      });
  }

  getSSLKeyTranslation() {
    let sslTranslationKey = this.endpoint.sslMode;
    // if key exists in translation, return translation key.
    if (SSL_MODE_REQUIRED.includes(sslTranslationKey)) {
      sslTranslationKey = `${TRANSLATION_PREFIX}_required`;
    } else if (SSL_MODE_NA.includes(sslTranslationKey)) {
      sslTranslationKey = `${TRANSLATION_PREFIX}_n/a`;
    } else if (SSL_MODE_SSL_TLS.includes(sslTranslationKey)) {
      sslTranslationKey = `${TRANSLATION_PREFIX}_SSL_TLS`;
    }
    return sslTranslationKey;
  }

  onRestApiServiceUriCopy(event) {
    // Clipboard has 2 elements input & button. Input event handler triggers click on button.
    // So click event-handler on oui-clipboard will be triggered twice.
    // For the expected behavior, considering only the click event on input element.
    if (event.target.tagName === 'INPUT') {
      this.trackDashboard(
        'general-information::kafka_rest_uri_copy_paste',
        'click',
      );
    }
  }

  trackKarapace(event) {
    if (event.target.tagName?.toLowerCase() === 'a') {
      this.trackDashboard(
        'general-information::karapace-documentation-website',
        'click',
      );
    }
  }

  trackEndpointChange(modelValue) {
    this.trackDashboard(
      `general_information::select_services::${modelValue.component}`,
      'click',
    );
  }

  $onDestroy() {
    this.stopPollingDatabaseStatus();
    this.stopPollingNodesStatus();
  }
}
