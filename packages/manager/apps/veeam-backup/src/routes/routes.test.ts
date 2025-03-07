// Listing page
const LISTING = '/';
const LISTING_TERMINATE = '/terminate/:serviceName';

// Dashboard page
const DASHBOARD = '/:serviceName';
const DASHBOARD_OVERVIEW = '/:serviceName';
const DASHBOARD_TERMINATE = '/:serviceName/terminate';
const DASHBOARD_ACTIVATE = '/:serviceName/activate';
const DASHBOARD_EDIT = '/:serviceName/edit';

// Dashboard stockage
const DASHBOARD_STOCKAGE = '/:serviceName/stockage';

// Config page
const CONFIG = '/config';
const ONBOARDING = '/onboarding';

export enum PageName {
  associate = 'associate',
  terminate = 'terminate',
  listing = 'listing',
}

export const routes = [
  {
    path: LISTING,
    currentPage: 'vrack-services.dashboard',
    tracking: [
      {
        description: 'Display page listing',
        pageType: 'listing',
        pageName: 'listing',
        type: 'page.display',
      },
      {
        description: 'Click on navigate to details',
        id: 'navigate-to-details',
        buttonType: 'Link',
        actionType: 'navigation',
        actions: ['details_vrack-services'],
        type: 'page.click',
      },
      {
        description: 'Click to go back',
        id: 'go_back',
        buttonType: 'Link',
        actionType: 'navigation',
        actions: ['go_back'],
        type: 'page.click',
      },
    ],
    children: [
      {
        path: LISTING_TERMINATE,
        tracking: [
          {
            description: 'Display listing modal terminate',
            pageType: 'popup',
            pageName: 'listing_modal_terminate',
            type: 'page.display',
          },
          {
            description: 'Click listing modal terminate',
            id: 'listing-modal-terminate',
            buttonType: 'button',
            actionType: 'action',
            actions: ['modal_terminate'],
            type: 'page.click',
          },
          {
            description: 'Click listing modal cancel',
            id: 'listing-modal-cancel',
            buttonType: 'button',
            actionType: 'action',
            actions: ['modal_cancel'],
            type: 'page.click',
          },
        ],
      },
    ],
  },
  {
    path: DASHBOARD,
    children: [
      {
        path: DASHBOARD_OVERVIEW,
        tracking: [
          {
            description: 'Display dashboard tab overview',
            pageType: 'dashboard',
            pageName: 'dashboard_tab_oververview',
            type: 'page.display',
          },
        ],
        children: [
          {
            path: DASHBOARD_TERMINATE,
            tracking: [
              {
                description: 'Display dashboard overview modal terminate',
                pageType: 'popup',
                pageName: 'dashboard_overview_modal_terminate',
                type: 'page.display',
              },
            ],
          },
          {
            path: DASHBOARD_ACTIVATE,
            tracking: [
              {
                description: 'Display dashboard overview modal active',
                pageType: 'popup',
                pageName: 'dashboard_overview_modal_activate',
                type: 'page.display',
              },
            ],
          },
          {
            path: DASHBOARD_EDIT,
            tracking: [
              {
                description: 'Display dashboard overview modal edit',
                pageType: 'popup',
                pageName: 'dashboard_edit_modal_edit',
                type: 'page.display',
              },
            ],
          },
        ],
      },
      {
        path: DASHBOARD_STOCKAGE,
        tracking: [
          {
            description: 'Display dashboard stockage',
            pageType: 'dashboard',
            pageName: 'dashboard_tab_stockage',
            type: 'page.display',
          },
        ],
      },
    ],
  },
  {
    path: ONBOARDING,
    tracking: [
      {
        description: 'Display onboarding page',
        pageType: 'onboarding',
        pageName: 'onboarding',
        type: 'page.display',
      },
    ],
  },
  {
    path: CONFIG,
    tracking: [
      {
        description: 'Display config page de veeam',
        pageType: 'funnel',
        pageName: 'add_veeam',
        type: 'page.display',
      },
    ],
  },
];

const test = () =>
  type === ModalTypeEnum.ERROR
    ? ODS_BUTTON_COLOR.critical
    : ODS_BUTTON_COLOR.primary;
