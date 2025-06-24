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
export const UNIVERSE = 'Enterprise_solutions';
export const APP_NAME = 'sap-features-hub';

type GetTrackingParams = (params: unknown) => TrackingClickParams;
type AppTracking = Record<
  string,
  Record<string, TrackingClickParams | GetTrackingParams>
>;

const defineTrackingConfig = <T extends AppTracking>(config: T) => config;

export const wizardPageName = `install_${APP_NAME}`;
const wizardAction = {
  install: wizardPageName,
  activate: `activate_${APP_NAME}`,
  start: `start_${APP_NAME}`,
};

export const TRACKING = defineTrackingConfig({
  dashboard: {
    linkClick: ({
      tileName,
      clickName,
    }: {
      tileName: string;
      clickName: string;
    }): TrackingClickParams => ({
      location: PageLocation.tile,
      buttonType: ButtonType.link,
      actionType: 'navigation',
      actions: [`go-to-${tileName}-${clickName}_${APP_NAME}`],
    }),
    externalLinkClick: ({
      tileName,
      type,
    }: {
      tileName: string;
      type: 'documentation' | 'git';
    }): TrackingClickParams => ({
      location: PageLocation.tile,
      buttonType: ButtonType.externalLink,
      actionType: 'navigation',
      actions: [`go-to-${tileName}-${type}_${APP_NAME}`],
    }),
    downloadBackint: {
      location: PageLocation.tile,
      buttonType: ButtonType.button,
      actionType: 'download',
      actions: [`download_${APP_NAME}`, 'sap-hana-backint-agent'],
    },
  },
  wizard: {
    start: {
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [wizardAction.install],
    },
    submit: (action: 'confirm' | 'cancel'): TrackingClickParams => ({
      location: PageLocation.popup,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [wizardAction.install, action],
    }),
  },
  installation: {
    chooseDeployment: {
      location: PageLocation.funnel,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [wizardAction.install, 'deployment'],
    },
    completeInformations: {
      location: PageLocation.funnel,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [wizardAction.install, 'information'],
    },
    provideSources: {
      location: PageLocation.funnel,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [wizardAction.install, 'sources'],
    },
    defineOsConfig: {
      location: PageLocation.funnel,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [wizardAction.install, 'os-configuration'],
    },
    virtualMachines: {
      location: PageLocation.funnel,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [wizardAction.install, 'virtual-machines'],
    },
    enableAdditionalFeatures: {
      location: PageLocation.funnel,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [wizardAction.activate, 'additional-features'],
    },
    startSAPDeployment: {
      location: PageLocation.funnel,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [wizardAction.start, 'deployment'],
    },
    submitSummary: (action: 'confirm' | 'previous') => ({
      location: PageLocation.funnel,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [wizardAction.install, action],
    }),
  },
});
