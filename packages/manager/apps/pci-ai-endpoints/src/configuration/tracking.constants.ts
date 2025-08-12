import {
  ButtonType,
  PageLocation,
  TrackingClickParams,
  PageType,
} from '@ovh-ux/manager-react-shell-client';

export const LEVEL2 = {
  EU: {
    config: {
      level2: '86',
    },
  },
  CA: {
    config: {
      level2: '86',
    },
  },
  US: {
    config: {
      level2: '86',
    },
  },
};
export const PCI_LEVEL2 = '86';
export const PAGE_PREFIX = 'PublicCloud::pci::projects';
export const ACTION_PREFIX = `${PAGE_PREFIX}::ai-endpoints`;
export const DISCOVERY_PLANCODE = 'project.discovery';

export const UNIVERSE = 'PublicCloud';
export const SUB_UNIVERSE = 'ai_machine_learning';
export const APP_NAME = 'ai_endpoints';

export const TRACKING = {
  metrics: {
    tabClick: (tabname: string): TrackingClickParams => ({
      actions: ['main-tabnav', tabname],
      actionType: 'action',
    }),
  },

  apikey: {
    createNewApikeyClick: {
      actions: [
        PageLocation.page,
        ButtonType.button,
        'create_api-key',
        APP_NAME,
      ] as string[],
      actionType: 'action',
      appName: APP_NAME,
      pageTheme: UNIVERSE,
      level2: PCI_LEVEL2,
      pageType: PageType.listing,
    },

    createNewApikeyPopUpShow: {
      pageName: `create_api-key`,
      pageType: PageType.popup,
      pageTheme: UNIVERSE,
      level2: PCI_LEVEL2,
    },

    successCreatApikeyPopUpShown: {
      name: `create_api-key_success`,
      pageType: PageType.popup,
      pageTheme: UNIVERSE,
      level2: PCI_LEVEL2,
    },

    confirmClick: {
      actions: [
        PageLocation.popup,
        ButtonType.button,
        'create_api-key',
        'confirm',
      ] as string[],
      actionType: 'action',
      appName: APP_NAME,
      pageTheme: UNIVERSE,
      pageType: PageType.popup,
      level2: PCI_LEVEL2,
    },
  },
} as const;
