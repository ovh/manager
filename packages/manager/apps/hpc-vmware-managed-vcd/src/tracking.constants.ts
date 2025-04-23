import {
  ButtonType,
  PageLocation,
  TrackingClickParams,
} from '@ovh-ux/manager-react-shell-client';

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
export const UNIVERSE = 'Enterprise';
export const SUB_UNIVERSE = 'HostedPrivatedCloud';
export const APP_NAME_TRACKING = 'managed-vcd';
export const APP_NAME = 'hpc-vmware-managed-vcd';

type GetTrackingParams = (param: string | string[]) => TrackingClickParams;
type AppTracking = Record<
  string,
  Record<string, TrackingClickParams | GetTrackingParams>
>;

const defineTrackingConfig = <T extends AppTracking>(config: T) => config;

export const TRACKING = defineTrackingConfig({
  onboarding: {
    guideClick: (guideName: string): TrackingClickParams => ({
      location: PageLocation.page,
      buttonType: ButtonType.externalLink,
      actionType: 'navigation',
      actions: [`go-to-${guideName}`],
    }),
  },
  listing: {
    details: {
      location: PageLocation.datagrid,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [`details_${APP_NAME_TRACKING}`],
    },
  },
  dashboard: {
    activateWindowsLicence: {
      location: PageLocation.tile,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: ['activate_windows_licence'],
    },
    goToVcdPortal: {
      location: PageLocation.tile,
      buttonType: ButtonType.externalLink,
      actionType: 'navigation',
      actions: ['go-to-access-vcd_portal'],
    },
    goToManageBackup: {
      location: PageLocation.tile,
      buttonType: ButtonType.externalLink,
      actionType: 'navigation',
      actions: ['go-to-see-manage_backup'],
    },
  },
  datacentreListing: {
    details: {
      location: PageLocation.datagrid,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: ['details_datacenter'],
    },
  },
  datacentreDashboard: {
    goToVcdPortal: {
      location: PageLocation.tile,
      buttonType: ButtonType.externalLink,
      actionType: 'navigation',
      actions: ['go-to-access-vcd_portal'],
    },
  },
  compute: {
    addVirtualHost: {
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: ['datacenter_add_virtual_hosting'],
    },
    orderConfirm: {
      location: PageLocation.funnel,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: ['datacenter_add_virtual_hosting', 'confirm'],
    },
    orderCancel: {
      location: PageLocation.funnel,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: ['datacenter_add_virtual_hosting', 'cancel'],
    },
  },
  storage: {
    addStorage: {
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: ['datacenter_add_storage'],
    },
    orderConfirm: {
      location: PageLocation.funnel,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: ['datacenter_add_storage', 'confirm'],
    },
    orderCancel: {
      location: PageLocation.funnel,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: ['datacenter_add_storage', 'cancel'],
    },
  },
});

export const TRACKING_TABS_ACTIONS = {
  dashboard: ['general-informations'],
  datacentres: ['datacenters'],
  datacentreDashboard: ['datacenter', 'general-informations'],
  compute: ['datacenter', 'compute'],
  storage: ['datacenter', 'storage'],
  vrackNetwork: ['vrack-network'],
};

export const getTabTrackingParams = (
  actions: string[],
): TrackingClickParams => ({
  location: PageLocation.page,
  buttonType: ButtonType.tab,
  actionType: 'navigation',
  actions,
});
