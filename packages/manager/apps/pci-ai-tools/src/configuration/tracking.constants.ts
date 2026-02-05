import ai from '@/types/AI';
import { PrivacyEnum } from '@/types/orderFunnel';

export const APP_TRACKING_PREFIX = 'PublicCloud::ai_machine_learning';
export const QUANTUM_APP_TRACKING_PREFIX = 'PublicCloud::quantum';

export const NOTEBOOK_TRACKING = `${APP_TRACKING_PREFIX}::ai_notebooks`;
export const DEPLOY_TRACKING = `${APP_TRACKING_PREFIX}::ai_deploy`;
export const TRAINING_TRACKING = `${APP_TRACKING_PREFIX}::ai_training`;
export const PCI_LEVEL2 = '86';

export const TRACKING = {
  notebooks: {
    onboarding: {
      createNotebookClick: () =>
        `${NOTEBOOK_TRACKING}::page::button::create_ai_notebooks`,
    },
    listing: {
      manageNotebooksDataGridClick: (option: string) =>
        `${NOTEBOOK_TRACKING}::datagrid::button::${option}_ai_notebooks`,
      DatagridLinkClick: (columnId: string) =>
        `${NOTEBOOK_TRACKING}::link::details_${columnId}`,
    },
    funnel: {
      createNotebookConfirmClick: (
        region: string,
        ressourceType: ai.capabilities.FlavorTypeEnum,
        framework: string,
      ) =>
        `${NOTEBOOK_TRACKING}::funnel::create_ai_notebooks_confirm::datacenter_${region}::ressource_type_${ressourceType}::framework_${framework}`,
      advancedConfigurationClick: () =>
        `${NOTEBOOK_TRACKING}::funnel::button::advanced-configuration_ai_notebooks`,
    },
    banner: {
      successBannerInfo: (
        region: string,
        ressourceType: ai.capabilities.FlavorTypeEnum,
        framework: string,
      ) =>
        `${NOTEBOOK_TRACKING}::banner-info::create_notebooks_success::datacenter_${region}::ressource_type_${ressourceType}::framework_${framework}`,
      errorBannerInfo: (
        region: string,
        ressourceType: ai.capabilities.FlavorTypeEnum,
        framework: string,
      ) =>
        `${NOTEBOOK_TRACKING}::banner-info::create_notebooks_error::datacenter_${region}::ressource_type_${ressourceType}::framework_${framework}`,
    },
  },

  training: {
    onboarding: {
      createTrainingClick: () =>
        `${TRAINING_TRACKING}::page::button::create_ai_training`,
    },
    listing: {
      createTrainingClick: () =>
        `${TRAINING_TRACKING}::page::button::create_ai_training`,
      stopTrainingDataGridClick: () =>
        `${TRAINING_TRACKING}::datagrid::button::stop_ai_training`,
      restartTrainingDataGridClick: () =>
        `${TRAINING_TRACKING}::datagrid::button::restart_ai_training`,
      deleteTrainingDataGridClick: () =>
        `${TRAINING_TRACKING}::datagrid::button::delete_ai_training`,
      manageTrainingDataGridClick: () =>
        `${TRAINING_TRACKING}::datagrid::button::manage_ai_training`,
      DatagridLinkClick: (columnId: string) =>
        `${TRAINING_TRACKING}::link::details_${columnId}`,
    },
    funnel: {
      createTrainingConfirmClick: (
        region: string,
        ressourceType: ai.capabilities.FlavorTypeEnum,
        access: PrivacyEnum,
      ) =>
        `${TRAINING_TRACKING}::funnel::create_ai_training_confirm::datacenter_${region}::ressource_type_${ressourceType}::access_${access}`,
      advancedConfigurationClick: () =>
        `${TRAINING_TRACKING}::funnel::button::advanced-configuration_ai_training`,
    },
    banner: {
      successBannerInfo: (
        region: string,
        ressourceType: ai.capabilities.FlavorTypeEnum,
        access: PrivacyEnum,
      ) =>
        `${TRAINING_TRACKING}::banner-info::create_training_success::datacenter_${region}::ressource_type_${ressourceType}::access_${access}`,

      errorBannerInfo: (
        region: string,
        ressourceType: ai.capabilities.FlavorTypeEnum,
        access: PrivacyEnum,
      ) =>
        `${TRAINING_TRACKING}::banner-info::create_training_error::datacenter_${region}::ressource_type_${ressourceType}::access_${access}`,
    },
  },

  deploy: {
    onboarding: {
      createDeployClick: () =>
        `${DEPLOY_TRACKING}::page::button::create_ai_deploy`,
    },
    listing: {
      createDeployClick: () =>
        `${DEPLOY_TRACKING}::page::button::create_ai_deploy`,
      stopDeployDataGridClick: () =>
        `${DEPLOY_TRACKING}::datagrid::button::stop_ai_deploy`,
      startDeployDataGridClick: () =>
        `${DEPLOY_TRACKING}::datagrid::button::start_ai_deploy`,
      deleteDeployDataGridClick: () =>
        `${DEPLOY_TRACKING}::datagrid::button::delete_ai_deploy`,
      manageDeployDataGridClick: () =>
        `${DEPLOY_TRACKING}::datagrid::button::manage_ai_deploy`,
      DatagridLinkClick: (columnId: string) =>
        `${DEPLOY_TRACKING}::link::details_${columnId}`,
    },
    funnel: {
      createDeployConfirmClick: (
        region: string,
        ressourceType: ai.capabilities.FlavorTypeEnum,
        access: PrivacyEnum,
      ) =>
        `${DEPLOY_TRACKING}::funnel::create_ai_deploy_confirm::datacenter_${region}::ressource_type_${ressourceType}::access_${access}`,
      advancedConfigurationClick: () =>
        `${DEPLOY_TRACKING}::funnel::button::advanced-configuration_ai_deploy`,
    },
    banner: {
      successBannerInfo: (
        region: string,
        ressourceType: ai.capabilities.FlavorTypeEnum,
        access: PrivacyEnum,
      ) =>
        `${DEPLOY_TRACKING}::banner-info::create_ai_deploy_success::datacenter_${region}::ressource_type_${ressourceType}::access_${access}`,
      errorBannerInfo: (
        region: string,
        ressourceType: ai.capabilities.FlavorTypeEnum,
        access: PrivacyEnum,
      ) =>
        `${DEPLOY_TRACKING}::banner-info::create_ai_deploy_error::datacenter_${region}::ressource_type_${ressourceType}::access_${access}`,
    },
  },

  emulators: {
    guide: {
      guideClick: () =>
        `${QUANTUM_APP_TRACKING_PREFIX}::emulators::guides::button::guides`,
      guideLinkClick: (guideName: string) =>
        `${QUANTUM_APP_TRACKING_PREFIX}::emulators::guides::link::${guideName}`,
    },
    onboarding: {
      createNotebookClick: () =>
        `${QUANTUM_APP_TRACKING_PREFIX}::emulators::button::create_notebook`,
    },
    listing: {
      createNotebooksClick: () =>
        `${QUANTUM_APP_TRACKING_PREFIX}::emulators::button::create_notebook`,
      manageNotebooksDataGridClick: (option: string) =>
        `${QUANTUM_APP_TRACKING_PREFIX}::emulators::datagrid::button::${option}_emulators`,
      DatagridLinkClick: () =>
        `${QUANTUM_APP_TRACKING_PREFIX}::emulators::datagrid::link::details_emulators`,
      DatagridEditorLinkClick: () =>
        `${QUANTUM_APP_TRACKING_PREFIX}::emulators::datagrid::external-link::editor_emulators`,
    },
    funnel: {
      advancedConfigurationClick: () =>
        `${QUANTUM_APP_TRACKING_PREFIX}::emulators::emulators::funnel::advanced-configuration_notebook`,
      configureSshKeyClick: () =>
        `${QUANTUM_APP_TRACKING_PREFIX}::emulators::emulators::funnel::configure_ssh-key`,
      confirmNotebookClick: () =>
        `${QUANTUM_APP_TRACKING_PREFIX}::emulators::emulators::funnel::confirm_notebook`,
    },
    popup: {
      configureSshKeyClick: (action: 'confirm' | 'cancel') =>
        `${QUANTUM_APP_TRACKING_PREFIX}::emulators::emulators::pop-up::configure_ssh-key::${action}`,
      startNotebookClick: (action: 'confirm' | 'cancel') =>
        `${QUANTUM_APP_TRACKING_PREFIX}::emulators::emulators::pop-up::start::${action}`,
      restartNotebookClick: (action: 'confirm' | 'cancel') =>
        `${QUANTUM_APP_TRACKING_PREFIX}::emulators::emulators::pop-up::restart::${action}`,
      stopNotebookClick: (action: 'confirm' | 'cancel') =>
        `${QUANTUM_APP_TRACKING_PREFIX}::emulators::emulators::pop-up::stop::${action}`,
      deleteNotebookClick: (action: 'confirm' | 'cancel') =>
        `${QUANTUM_APP_TRACKING_PREFIX}::emulators::emulators::pop-up::delete::${action}`,
    },
    banner: {
      createNotebookBanner: (type: 'info' | 'error', status: string) =>
        `${QUANTUM_APP_TRACKING_PREFIX}::emulators::emulators::banner-${type}::create_notebook::${status}`,
      configureSshKeyBanner: (type: 'info' | 'error', status: string) =>
        `${QUANTUM_APP_TRACKING_PREFIX}::emulators::emulators::banner-${type}::configure_ssh-key::${status}`,
    },
    roadmap: {
      linkClick: (linkType: 'roadmap' | 'changelog' | 'feature-request') =>
        `${QUANTUM_APP_TRACKING_PREFIX}::emulators::emulators::page::external-link::go-to-${linkType}`,
    },
  },

  qpus: {
    guide: {
      guideClick: () =>
        `${QUANTUM_APP_TRACKING_PREFIX}::qpus::guides::button::guides`,
      guideLinkClick: (guideName: string) =>
        `${QUANTUM_APP_TRACKING_PREFIX}::qpus::guides::link::${guideName}`,
    },
    onboarding: {
      createNotebookClick: () =>
        `${QUANTUM_APP_TRACKING_PREFIX}::qpus::button::create_notebook`,
    },
    listing: {
      createNotebooksClick: () =>
        `${QUANTUM_APP_TRACKING_PREFIX}::qpus::button::create_notebook`,
      manageNotebooksDataGridClick: (option: string) =>
        `${QUANTUM_APP_TRACKING_PREFIX}::qpus::datagrid::button::${option}_qpus`,
      DatagridLinkClick: () =>
        `${QUANTUM_APP_TRACKING_PREFIX}::qpus::datagrid::link::details_qpus`,
      DatagridEditorLinkClick: () =>
        `${QUANTUM_APP_TRACKING_PREFIX}::qpus::datagrid::external-link::editor_qpus`,
    },
    funnel: {
      advancedConfigurationClick: () =>
        `${QUANTUM_APP_TRACKING_PREFIX}::qpus::qpus::funnel::advanced-configuration_notebook`,
      configureSshKeyClick: () =>
        `${QUANTUM_APP_TRACKING_PREFIX}::qpus::qpus::funnel::configure_ssh-key`,
      confirmNotebookClick: () =>
        `${QUANTUM_APP_TRACKING_PREFIX}::qpus::qpus::funnel::confirm_notebook`,
    },
    popup: {
      configureSshKeyClick: (action: 'confirm' | 'cancel') =>
        `${QUANTUM_APP_TRACKING_PREFIX}::qpus::qpus::pop-up::configure_ssh-key::${action}`,
      startNotebookClick: (action: 'confirm' | 'cancel') =>
        `${QUANTUM_APP_TRACKING_PREFIX}::qpus::qpus::pop-up::start::${action}`,
      restartNotebookClick: (action: 'confirm' | 'cancel') =>
        `${QUANTUM_APP_TRACKING_PREFIX}::qpus::qpus::pop-up::restart::${action}`,
      stopNotebookClick: (action: 'confirm' | 'cancel') =>
        `${QUANTUM_APP_TRACKING_PREFIX}::qpus::qpus::pop-up::stop::${action}`,
      deleteNotebookClick: (action: 'confirm' | 'cancel') =>
        `${QUANTUM_APP_TRACKING_PREFIX}::qpus::qpus::pop-up::delete::${action}`,
    },
    banner: {
      createNotebookBanner: (type: 'info' | 'error', status: string) =>
        `${QUANTUM_APP_TRACKING_PREFIX}::qpus::qpus::banner-${type}::create_notebook::${status}`,
      configureSshKeyBanner: (type: 'info' | 'error', status: string) =>
        `${QUANTUM_APP_TRACKING_PREFIX}::qpus::qpus::banner-${type}::configure_ssh-key::${status}`,
    },
    roadmap: {
      linkClick: (linkType: 'roadmap' | 'changelog' | 'feature-request') =>
        `${QUANTUM_APP_TRACKING_PREFIX}::qpus::qpus::page::external-link::go-to-${linkType}`,
    },
  },
};
