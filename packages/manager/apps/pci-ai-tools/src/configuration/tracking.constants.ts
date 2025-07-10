import ai from '@/types/AI';
import { PrivacyEnum } from '@/types/orderFunnel';

export const APP_TRACKING_PREFIX = 'PublicCloud::ai_machine_learning';
export const NOTEBOOK_TRACKING = `${APP_TRACKING_PREFIX}::ai_notebooks`;
export const PCI_LEVEL2 = '86';
export const DISCOVERY_PLANCODE = 'project.discovery';

export const TRACKING = {
  notebooks: {
    onboarding: {
      createNotebooksClick: () =>
        `${NOTEBOOK_TRACKING}::page::button::create_notebooks`,
    },
    listing: {
      createNotebooksClick: () =>
        `${NOTEBOOK_TRACKING}::page::button::create_notebooks`,
      stopNotebooksDataGridClick: () =>
        `${NOTEBOOK_TRACKING}::datagrid::button::stop_notebooks`,
    },
    funnel: {
      createNotebookConfirmClick: (
        region: string,
        ressourceType: ai.capabilities.FlavorTypeEnum,
        vcore: string,
        storage: string,
        price: number,
        framework: string,
        editor: string,
        access: PrivacyEnum,
        resourcesQuantity: number,
      ) =>
        `${NOTEBOOK_TRACKING}::funnel::create_notebooks::${region}_${ressourceType}_${vcore}_${storage}_${price}_${framework}_${editor}_${access}_${resourcesQuantity}`,
      successBannerInfo: () =>
        `${NOTEBOOK_TRACKING}::banner-info::create_notebooks_success`,
    },
    // keep same structure
  },
};
