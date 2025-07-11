import {
  ButtonType,
  PageLocation,
  TrackingClickParams,
  PageType,
} from '@ovh-ux/manager-react-shell-client';

export const APP_TRACKING_PREFIX = 'PublicCloud::ai::notebooks';
export const PCI_LEVEL2 = '86';
export const DISCOVERY_PLANCODE = 'project.discovery';
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
export const UNIVERSE = 'PublicCloud';
export const SUB_UNIVERSE = 'ai_machine_learning';
export const APP_NAME = 'ai_notebooks';
export const TRACKING: Record<
  string,
  Record<string, TrackingClickParams | any>
> = {
  notebooksOnBoarding: {
    onBoarding: {
      actions: [`${APP_NAME}`, `${PageType.onboarding}`],
      actionType: 'action',
    },

    createNewNotebookClick: {
      actions: [
        `${PageLocation.page}`,
        `${ButtonType.button}`,
        `create_ai_notebooks`,
      ],
      actionType: 'action',
    },

    findOutMoreClick: {
      actions: [
        `${PageLocation.tile}`,
        `${ButtonType.button}`,
        `documentation-title`,
      ],
      actionType: 'action',
    },
  },

  notebooksListing: {
    onBoarding: {
      actions: [`${APP_NAME}`, `${PageType.listing}`],
      actionType: 'action',
    },

    ellipsisChoiceClick: (optionClicked: string): TrackingClickParams => {
      return {
        location: PageLocation.datagrid,
        buttonType: ButtonType.button,
        actions: [
          UNIVERSE,
          'ai_maching_learning',
          APP_NAME,
          PageLocation.datagrid,
          ButtonType.button,
          optionClicked,
          APP_NAME,
        ],
        actionType: 'action',
      };
    },

    DatagridClick: (columnName: string): TrackingClickParams => {
      return {
        actions: [ButtonType.link, `details_${columnName}`],
        actionType: 'action',
      };
    },
  },

  notebooksFunnel: {
    onBoarding: {
      actions: [`${APP_NAME}`, `${PageType.funnel}`, 'create_ai_notebooks'],
      actionType: 'action',
    },

    orderClick: {
      actions: [
        `${PageType.funnel}`,
        `${ButtonType.button}`,
        'create_ai_notebooks_confirm',
      ],
      actionType: 'action',
    },
  },

  notebooksBanner: {
    bannerDisplayedSuccess: {
      actions: [
        `${APP_NAME}`,
        `${PageType.bannerInfo}`,
        'create_ai_notebooks_success',
      ],
      actionType: 'action',
    },

    bannerDisplayedError: {
      actions: [
        `${APP_NAME}`,
        `${PageType.bannerError}`,
        'create_ai_notebooks_err',
      ],
      actionType: 'action',
    },
  },
} as const;
