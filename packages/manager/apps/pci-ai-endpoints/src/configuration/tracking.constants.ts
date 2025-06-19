import {
  ButtonType,
  PageLocation,
  TrackingClickParams,
  PageType,
  TrackingContextParams,
} from '@ovh-ux/manager-react-shell-client';

export const PCI_LEVEL2 = '86';
export const PAGE_PREFIX = 'PublicCloud::pci::projects';
export const ACTION_PREFIX = `${PAGE_PREFIX}::ai-endpoints`;
export const DISCOVERY_PLANCODE = 'project.discovery';

export const UNIVERSE = 'PublicCloud';
export const SUB_UNIVERSE = 'ai_machine_learning';
export const APP_NAME = 'ai_endpoints';

/* Extensions to the base interfaces to allow extra fields */
interface ExtendedClickParams extends TrackingClickParams {
  appName: string;
  pageTheme: string;
  level2: string;
  page_category?: PageType;
}

interface ExtendedContextParams extends TrackingContextParams {
  name: string;
  page_category: PageLocation;
}

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
      ],
      actionType: 'action',
      appName: APP_NAME,
      pageTheme: UNIVERSE,
      level2: PCI_LEVEL2,
      page_category: PageType.listing,
    } as ExtendedClickParams,

    createNewApikeyPopUpShow: {
      name: `${UNIVERSE}::${SUB_UNIVERSE}::${APP_NAME}::${APP_NAME}::${PageLocation.popup}::create_api-key`,
      pageTheme: UNIVERSE,
      level2: PCI_LEVEL2,
      page_category: PageLocation.popup,
    } as ExtendedContextParams,

    successCreatApikeyPopUpShown: {
      name: `${UNIVERSE}::${SUB_UNIVERSE}::${APP_NAME}::${APP_NAME}::${PageLocation.popup}::create_api-key_success`,
      pageTheme: UNIVERSE,
      level2: PCI_LEVEL2,
      page_category: PageLocation.popup,
    } as ExtendedContextParams,

    confirmClick: {
      actions: [
        PageLocation.popup,
        ButtonType.button,
        'create_api-key',
        'confirm',
      ],
      actionType: 'action',
      appName: APP_NAME,
      pageTheme: UNIVERSE,
      level2: PCI_LEVEL2,
    } as ExtendedClickParams,
  },
} as const;
