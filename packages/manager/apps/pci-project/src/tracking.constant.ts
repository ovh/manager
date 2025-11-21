import { ButtonType, PageLocation } from '@ovh-ux/manager-react-shell-client';

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
export const SUB_UNIVERSE = 'projects';
export const APP_NAME = 'projects-management';

export const PROJECTS_TRACKING = {
  LISTING: {
    PAGE_NAME: '',
    CTA_CREATE_PROJECT: [
      PageLocation.page,
      ButtonType.button,
      'create_project',
    ],
    SHOW_PROJECT: [PageLocation.page, ButtonType.button, 'detail_project'],
    DELETE_PROJECT: [
      PageLocation.datagrid,
      ButtonType.button,
      'delete_project',
    ],
    PAY_BILL: [PageLocation.page, ButtonType.button, 'pay_bill'],
  },
  ONBOARDING: {
    PAGE_NAME: 'home',
    CTA_CREATE_PROJECT: [
      PageLocation.page,
      ButtonType.button,
      'create_project',
    ],
  },
  DELETE: {
    PAGE_NAME: 'delete_project',
    CTA_CANCEL: [
      PageLocation.popup,
      ButtonType.button,
      'delete_project',
      'cancel',
    ],
    CTA_CONFIRM: [
      PageLocation.popup,
      ButtonType.button,
      'delete_project',
      'confirm',
    ],
    REQUEST_FAIL: 'delete_project_error',
    REQUEST_SUCCESS: 'delete_project_success',
  },
  TABS: {
    HOME_TAB: 'home',
    SETTINGS_TAB: 'settings',
  },
  SETTINGS: {
    PAGE_NAME: 'edit_project-setting',
    UPDATE_PROJECT_NAME: [
      PageLocation.page,
      ButtonType.button,
      'update_project-name',
    ],
    UPDATE_PROJECT_NAME_ERROR: 'update_project-name_error',
    REQUEST_SUCCESS: 'update_project-name_success',
    REQUEST_ERROR: 'update_project-name_error',
    HDS_SECTION: {
      CTA_UPDATE_HDS: [
        PageLocation.page,
        ButtonType.button,
        'update_compliance',
      ],
      REQUEST_SUCCESS: 'update_compliance_success',
      REQUEST_ERROR: 'update_compliance_error',
    },
    CTA_DELETE_PROJECT: [
      PageLocation.page,
      ButtonType.button,
      'delete_project',
    ],
  },
  PROJECT_HOME: {
    PAGE_NAME: 'project-home',
    CTA_ANNOUNCEMENT_BANNER: [
      PageLocation.page,
      ButtonType.button,
      'announcement_banner_activation',
    ],
    CTA_DISCOVERY_BANNER: [
      PageLocation.page,
      ButtonType.button,
      'discovery_banner_activation',
    ],
  },
  CREATION: {
    PAGE_NAME: 'create_project',
    CONFIG_STEP: {
      CTA_NEXT: [
        PageLocation.funnel,
        ButtonType.button,
        'create_project',
        'name',
        'next',
      ],
      CTA_BACK: [
        PageLocation.funnel,
        ButtonType.button,
        'create_project',
        'name',
        'back',
      ],
    },
    PAYMENT_STEP: {
      PAGE_NAME: 'select_payment',
      CTA_NEXT: [
        PageLocation.funnel,
        ButtonType.button,
        'create_project',
        'select_payment',
        'next',
      ],
      CTA_BACK: [
        PageLocation.funnel,
        ButtonType.button,
        'create_project',
        'select_payment',
        'back',
      ],
      ADD_VOUCHER: [
        PageLocation.funnel,
        ButtonType.button,
        'create_project',
        'select_payment',
        'add_voucher',
      ],
      ADD_VOUCHER_ERROR: 'add_voucher_error',
      ADD_VOUCHER_SUCCESS: 'add_voucher_success',
    },
  },
  CREATING: {
    PAGE_NAME: 'creating',
    CTA_GUIDE: [
      PageLocation.funnel,
      ButtonType.link,
      'create_project',
      'creating',
      'pci-guides',
    ],
    CTA_OTHER_PROJECTS: [
      PageLocation.funnel,
      'link',
      'create_project',
      'creating',
      'other-projects',
    ],
    PROJECT_DELIVERED: 'project_created',
    PROJECT_DELIVERY_FAILED: 'project_creation_error',
  },
  UPDATING: {
    PAGE_NAME: 'projects-updating',
    CTA_GUIDE: [PageLocation.page, ButtonType.button, 'guide'],
    PROJECT_UPDATED: 'updated',
    UPDATE_PROJECT_SUCCESS: 'update-project-success',
    UPDATE_PROJECT_ERROR: 'update-project-error',
  },
  ACTIVATE: {
    PAGE_NAME: 'activate-project',
    ERROR_PAGE: 'activate-project-error',
    SUCCESS_CONVERSION: {
      name: 'PCI project creation',
      tc_additional_params: {
        pcat: 'publiccloud',
        ot: 'pci_project_creation',
        pci_mode: 'discovery',
      },
    },
  },
  ACTIVATE_PROJECT_MODAL: {
    CTA_CANCEL: [
      PageLocation.page,
      ButtonType.button,
      'activate-project-modal',
      'cancel',
    ],
    CTA_CONFIRM: [
      PageLocation.page,
      ButtonType.button,
      'activate-project-modal',
      'confirm',
    ],
  },
};
