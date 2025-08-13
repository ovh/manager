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
export const APP_NAME_TRACKING = 'vcfaas';
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
    delete: {
      location: PageLocation.datagrid,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [`delete_${APP_NAME_TRACKING}`],
    },
  },
  dashboard: {
    accessVcd: {
      location: PageLocation.tile,
      buttonType: ButtonType.link,
      actionType: 'action',
      actions: ['access_vcd'],
    },
    detailVrack: {
      location: PageLocation.tile,
      buttonType: ButtonType.link,
      actionType: 'action',
      actions: ['detail_vrack'],
    },
    copyUrlApi: {
      location: PageLocation.tile,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: ['copy_url-api'],
    },
    copyId: {
      location: PageLocation.tile,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: ['copy_id'],
    },
    upgradeVcpuSpeed: {
      location: PageLocation.tile,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: ['upgrade_vcpu-speed'],
    },
    activateWindowsLicence: {
      location: PageLocation.tile,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: ['activate_windows_licence'],
    },
    goToVcdPortal: {
      location: PageLocation.tile,
      buttonType: ButtonType.link,
      actionType: 'navigation',
      actions: ['access-vcd'],
    },
    goToManageBackup: {
      location: PageLocation.tile,
      buttonType: ButtonType.externalLink,
      actionType: 'navigation',
      actions: ['go-to-see-manage_backup'],
    },
  },
  vcpuSpeedPopup: {
    cancel: {
      location: PageLocation.popup,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: ['cancel'],
    },
    confirm: {
      location: PageLocation.popup,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: ['confirm'],
    },
  },
  dashboardNavBar: {
    generalInformations: {
      location: PageLocation.mainTabnav,
      buttonType: ButtonType.tab,
      actionType: 'navigation',
      actions: ['general-informations'],
    },
    compute: {
      location: PageLocation.mainTabnav,
      buttonType: ButtonType.tab,
      actionType: 'navigation',
      actions: ['compute'],
    },
    storage: {
      location: PageLocation.mainTabnav,
      buttonType: ButtonType.tab,
      actionType: 'navigation',
      actions: ['storage'],
    },
    vrack: {
      location: PageLocation.mainTabnav,
      buttonType: ButtonType.tab,
      actionType: 'navigation',
      actions: ['vrack'],
    },
    edgeGateway: {
      location: PageLocation.mainTabnav,
      buttonType: ButtonType.tab,
      actionType: 'navigation',
      actions: ['edge-gateways'],
    },
  },
  dashboardTerminate: {
    confirm: {
      location: PageLocation.popup,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [`delete_${APP_NAME_TRACKING}`, 'confirm'],
    },
    cancel: {
      location: PageLocation.popup,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [`delete_${APP_NAME_TRACKING}`, 'cancel'],
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
      buttonType: ButtonType.link,
      actionType: 'navigation',
      actions: ['access-vcd'],
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
  vrack: {
    modifyVlanId: {
      location: PageLocation.datagrid,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: ['modify_id-vlan'],
    },
    addNetwork: {
      location: PageLocation.datagrid,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: ['add_network'],
    },
    deleteSegment: {
      location: PageLocation.datagrid,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: ['delete_vcfaas-segment'],
    },
  },
  vrackModifyVlanId: {
    confirm: {
      location: PageLocation.popup,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: ['modify_id-vlan', 'confirm'],
    },
    cancel: {
      location: PageLocation.popup,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: ['modify_id-vlan', 'cancel'],
    },
  },
  vrackDeleteSegment: {
    confirm: {
      location: PageLocation.popup,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: ['delete_vcfaas-segment', 'confirm'],
    },
    cancel: {
      location: PageLocation.popup,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: ['delete_vcfaas-segment', 'cancel'],
    },
  },
  vrackAddNetwork: {
    confirm: {
      location: PageLocation.popup,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: ['add_network', 'confirm'],
    },
    cancel: {
      location: PageLocation.popup,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: ['add_network', 'cancel'],
    },
  },
  common: {
    order: {
      location: PageLocation.page,
      buttonType: ButtonType.externalLink,
      actionType: 'action',
      actions: ['order_managed_vcd'],
    },
  },
});

export const TRACKING_TABS_ACTIONS = {
  dashboard: ['general-informations'],
  datacentres: ['datacenters'],
  compute: ['compute'],
  storage: ['storage'],
  vrack: ['vrack'],
  edgeGateways: ['edge-gateways'],
};

export const getTabTrackingParams = (
  actions: string[],
): TrackingClickParams => ({
  location: PageLocation.mainTabnav,
  buttonType: ButtonType.tab,
  actionType: 'navigation',
  actions,
});
