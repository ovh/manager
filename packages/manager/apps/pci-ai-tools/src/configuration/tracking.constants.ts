import ai from '@/types/AI';
import { PrivacyEnum } from '@/types/orderFunnel';

export const APP_TRACKING_PREFIX = 'PublicCloud::ai_machine_learning';
export const NOTEBOOK_TRACKING = `${APP_TRACKING_PREFIX}::ai_notebooks`;
export const PCI_LEVEL2 = '86';
export const DISCOVERY_PLANCODE = 'project.discovery';

export const TRACKING = {
  notebooks: {
    listing: {
      createNotebooksClick: () =>
        `${NOTEBOOK_TRACKING}::page::button::create_ai_notebooks`,
      stopNotebooksDataGridClick: () =>
        `${NOTEBOOK_TRACKING}::datagrid::button::stop_ai_notebooks`,
    },
    funnel: {
      createNotebookConfirmClick: (
        region: string,
        ressourceType: ai.capabilities.FlavorTypeEnum,
        framework: string,
        editor: string,
        access: PrivacyEnum,
        resourcesQuantity: number,
      ) =>
        `${NOTEBOOK_TRACKING}::funnel::create_ai_notebooks_confirm::datacenter_${region}::ressource_type_${ressourceType}::framework_${framework}::editor_${editor}::access_${access}::resourcesQuantity_${resourcesQuantity}`,
      successBannerInfo: () =>
        `${NOTEBOOK_TRACKING}::banner-info::create_notebooks_success`,
    },
    // keep same structure
  },
};
