import ai from '@/types/AI';
import { PrivacyEnum } from '@/types/orderFunnel';

export const APP_TRACKING_PREFIX = 'PublicCloud::ai_machine_learning';
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
      createNotebooksClick: () =>
        `${NOTEBOOK_TRACKING}::page::button::create_ai_notebooks`,
      stopNotebooksDataGridClick: () =>
        `${NOTEBOOK_TRACKING}::datagrid::button::stop_ai_notebooks`,
      startNotebooksDataGridClick: () =>
        `${NOTEBOOK_TRACKING}::datagrid::button::start_ai_notebooks`,
      deleteNotebooksDataGridClick: () =>
        `${NOTEBOOK_TRACKING}::datagrid::button::delete_ai_notebooks`,
      manageNotebooksDataGridClick: () =>
        `${NOTEBOOK_TRACKING}::datagrid::button::manage_ai_notebooks`,
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
};
