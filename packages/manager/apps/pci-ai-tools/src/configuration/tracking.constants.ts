import {
  ButtonType,
  PageLocation,
  TrackingClickParams,
  PageType,
} from '@ovh-ux/manager-react-shell-client';
import { APP_NAME, UNIVERSE } from './pci.constant';

export const APP_TRACKING_PREFIX = 'PublicCloud::ai::notebooks';
export const PCI_LEVEL2 = '86';
export const PAGE_PREFIX = 'PublicCloud::pci::projects::project';
export const ACTION_PREFIX = `${PAGE_PREFIX}::ai-endpoints`;
export const DISCOVERY_PLANCODE = 'project.discovery';

export const TRACKING: Record<
  string,
  Record<string, TrackingClickParams | any>
> = {
  notebooksOnBoarding: {
    onBoarding: {
      actions: [
        `${UNIVERSE}`,
        'ai_maching_learning',
        `${APP_NAME}`,
        `${APP_NAME}`,
        `${PageType.onboarding}`,
      ],
      actionType: 'action',
    },

    createNewNotebookClick: {
      actions: [
        `${UNIVERSE}`,
        'ai_maching_learning',
        `${APP_NAME}`,
        `${PageLocation.page}`,
        `${ButtonType.button}`,
        `create_ai_notebooks`,
      ],
      actionType: 'action',
    },

    findOutMoreClick: {
      actions: [
        `${UNIVERSE}`,
        'ai_maching_learning',
        `${APP_NAME}`,
        `${PageLocation.tile}`,
        `${ButtonType.button}`,
        `documentation-title`,
      ],
      actionType: 'action',
    },
  },

  notebooksListing: {
    onBoarding: {
      actions: [
        `${UNIVERSE}`,
        'ai_maching_learning',
        `${APP_NAME}`,
        `${APP_NAME}`,
        `${PageType.listing}`,
      ],
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
        location: PageLocation.datagrid,
        buttonType: ButtonType.button,
        actions: [
          UNIVERSE,
          'ai_maching_learning',
          APP_NAME,
          ButtonType.link,
          `details_${columnName}`,
        ],
        actionType: 'action',
      };
    },
  },

  notebooksFunnel: {
    onBoarding: {
      actions: [
        `${UNIVERSE}`,
        'ai_maching_learning',
        `${APP_NAME}`,
        `${APP_NAME}`,
        `${PageType.funnel}`,
        'create_ai_notebooks',
      ],
      actionType: 'action',
    },

    locationClick: {
      actions: [
        `${UNIVERSE}`,
        'ai_maching_learning',
        `${APP_NAME}`,
        `${PageType.funnel}`,
        `${ButtonType.button}`,
        'advanced-configuration_ai_notebooks',
      ],
      actionType: 'action',
    },

    orderClick: {
      actions: [
        `${UNIVERSE}`,
        'ai_maching_learning',
        `${APP_NAME}`,
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
        `${UNIVERSE}`,
        'ai_maching_learning',
        `${APP_NAME}`,
        `${APP_NAME}`,
        `${PageType.bannerInfo}`,
        'create_ai_notebooks_success',
      ],
      actionType: 'action',
    },

    bannerDisplayedError: {
      actions: [
        `${UNIVERSE}`,
        'ai_maching_learning',
        `${APP_NAME}`,
        `${APP_NAME}`,
        `${PageType.bannerError}`,
        'create_ai_notebooks_err',
      ],
      actionType: 'action',
    },
  },
} as const;
