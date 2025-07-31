import {
  ButtonType,
  PageLocation,
  TrackingPageParams,
  TrackingClickParams,
  PageType,
} from '@ovh-ux/manager-react-shell-client';

import { appName } from './veeam-backup.config';

export const LEVEL2 = {
  EU: {
    config: {
      level2: '120',
    },
  },
  CA: {
    config: {
      level2: '120',
    },
  },
  US: {
    config: {
      level2: '120',
    },
  },
};

export const UNIVERSE = 'Manager';
export const SUB_UNIVERSE = 'Manager';
export const APP_NAME = appName;

export const TRACKING_CONTEXT = {
  chapter1: 'Entreprise_solutions',
  chapter2: 'storage-backups',
  chapter3: 'managed-veeam-vcd',
  appName: 'managed-veeam-vcd',
  pageTheme: 'Entreprise_solutions',
  level2Config: LEVEL2,
};

export enum PageName {
  successDeleteVeeamBackup = 'delete_veeam-backup_success',
  errorDeleteVeeamBackup = 'delete_veeam-backup_error',
  successUpdateVeeamBackup = 'update_veeam-backup_success',
  errorUpdateVeeamBackup = 'update_veeam-backup_error',
  successActivateOfferGold = 'activate_gold_success',
  errorActivateOfferGold = 'activate_gold_error',
}

type TrackingPageConfig = {
  page?: TrackingPageParams;
  clicks?: Record<string, TrackingClickParams>;
};

type TrackingConfig = Record<string, TrackingPageConfig>;

const defineTrackingConfig = <T extends TrackingConfig>(config: T) => config;

export const TRACKING = defineTrackingConfig({
  listing: {
    page: {
      pageName: 'listing',
      pageType: PageType.listing,
    },
  },
  deleteVeeam: {
    page: {
      pageName: 'delete_veeam-backup',
      pageType: PageType.popup,
    },
    clicks: {
      closeModal: {
        location: PageLocation.popup,
        buttonType: ButtonType.button,
        actionType: 'exit',
        actions: ['delete_veeam-backup', 'cancel'],
      },
      confirmDelete: {
        location: PageLocation.popup,
        buttonType: ButtonType.button,
        actionType: 'action',
        actions: ['delete_veeam-backup', 'confirm'],
      },
    },
  },
  dashboard: {
    page: {
      pageType: PageType.dashboard,
    },
    clicks: {
      activateGold: {
        location: PageLocation.tile,
        buttonType: ButtonType.button,
        actionType: 'action',
        actions: ['activate_gold', 'managed_veeam_vcd'],
      },
    },
  },
  editVeeamDisplayNameFromDashboard: {
    page: {
      pageName: 'edit_veeam-backup',
      pageType: PageType.popup,
    },
    clicks: {
      closeModal: {
        location: PageLocation.popup,
        buttonType: ButtonType.button,
        actionType: 'exit',
        actions: ['edit_veeam-backup', 'cancel'],
      },
      confirmEdit: {
        location: PageLocation.popup,
        buttonType: ButtonType.button,
        actionType: 'action',
        actions: ['edit_veeam-backup', 'confirm'],
      },
    },
  },
  deleteVeeamFromDashboard: {
    page: {
      pageName: 'delete_veeam-backup',
      pageType: PageType.popup,
    },
  },
  orderVeeam: {
    page: {
      pageName: 'order-veeam',
      pageType: PageType.funnel,
    },
  },
  onboarding: {
    page: {
      pageName: 'onboarding',
      pageType: PageType.onboarding,
    },
  },
  activateVeeamBackupOffer: {
    page: {
      pageName: 'activate_gold',
      pageType: PageType.popup,
    },
    clicks: {
      confirmActivation: {
        location: PageLocation.popup,
        buttonType: ButtonType.button,
        actionType: 'action',
        actions: ['activate_gold', 'confirm', 'managed_veeam_vcd'],
      },
      closeModal: {
        location: PageLocation.popup,
        buttonType: ButtonType.button,
        actionType: 'action',
        actions: ['activate_gold', 'cancel', 'managed_veeam_vcd'],
      },
    },
  },
});
