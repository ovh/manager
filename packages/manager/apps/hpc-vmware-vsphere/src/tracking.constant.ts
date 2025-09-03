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
export const SUB_UNIVERSE = 'platforms';
export const APP_NAME_TRACKING = 'managed-vmware';
export const APP_NAME = 'hpc-vmware-vsphere';

type GetTrackingParams = (param: string | string[]) => TrackingClickParams;

type AppTracking = Record<
  string,
  Record<string, TrackingClickParams | GetTrackingParams>
>;

const defineTrackingConfig = <T extends AppTracking>(config: T) => config;

export const TRACKING = defineTrackingConfig({
  logsOnboarding: {
    upgradeToPremier: {
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: ['upgrade-to-premier'],
    },
    activateLogsTransfert: {
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: ['activate-logs-transfert'],
    },
    activateLogsTransfertViaSyslog: {
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: ['activate_logs_transfer-via-syslog'],
    },
    goToSeeMoreLogs: {
      location: PageLocation.page,
      buttonType: ButtonType.externalLink,
      actionType: 'action',
      actions: ['go-to-see-more-logs'],
    },
  },
});
