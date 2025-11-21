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
    CTA_CREATE_PROJECT: ['page', 'button', 'create_project'],
    SHOW_PROJECT: ['page', 'button', 'detail_project'],
    DELETE_PROJECT: ['datagrid', 'button', 'delete_project'],
    PAY_BILL: ['page', 'button', 'pay_bill'],
  },
  ONBOARDING: {
    PAGE_NAME: 'projects-management',
    CTA_CREATE_PROJECT: ['page', 'button', 'create_project'],
  },
  DELETE: {
    PAGE_NAME: 'delete_project',
    CTA_CANCEL: ['pop-up', 'button', 'delete_project', 'cancel'],
    CTA_CONFIRM: ['pop-up', 'button', 'delete_project', 'confirm'],
    REQUEST_FAIL: 'delete_project_error',
    REQUEST_SUCCESS: 'delete_project_success',
  },
  TABS: {
    HOME_TAB: 'home',
    SETTINGS_TAB: 'settings',
  },
  SETTINGS: {
    PAGE_NAME: 'edit',
    UPDATE_PROJECT_NAME: ['page', 'button', 'update_project-name'],
    UPDATE_PROJECT_NAME_ERROR: 'update_project-name_error',
    REQUEST_SUCCESS: 'update_project-name_success',
    REQUEST_ERROR: 'update_project-name_error',
    HDS_SECTION: {
      CTA_UPDATE_HDS: ['page', 'button', 'update_compliance'],
      REQUEST_SUCCESS: 'update_compliance_success',
      REQUEST_ERROR: 'update_compliance_error',
    },
    CTA_DELETE_PROJECT: ['page', 'button', 'delete_project'],
  },
  PROJECT_HOME: {
    PAGE_NAME: 'project-detail',
    CTA_ANNOUNCEMENT_BANNER: [
      'page',
      'button',
      'announcement_banner_activation',
    ],
    CTA_DISCOVERY_BANNER: ['page', 'button', 'discovery_banner_activation'],
  },
  CREATION: {
    PAGE_NAME: 'new',
    CONFIG_STEP: {
      CTA_NEXT: ['funnel', 'button', 'create_project', 'name', 'next'],
      CTA_BACK: ['funnel', 'button', 'create_project', 'name', 'back'],
    },
    PAYMENT_STEP: {
      CTA_NEXT: [
        'funnel',
        'button',
        'create_project',
        'select_payment',
        'next',
      ],
      CTA_BACK: [
        'funnel',
        'button',
        'create_project',
        'select_payment',
        'back',
      ],

      ADD_VOUCHER: [
        'funnel',
        'button',
        'create_project',
        'select_payment',
        'voucher',
        'add',
      ],
      ADD_VOUCHER_ERROR: 'add_voucher_error',
      ADD_VOUCHER_SUCCESS: 'add_voucher_success',
    },
  },
  CREATING: {
    PAGE_NAME: 'creating',
    CTA_GUIDE: ['funnel', 'link', 'create_project', 'creating', 'pci-guides'],
    CTA_OTHER_PROJECTS: [
      'funnel',
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
    CTA_GUIDE: ['page', 'button', 'guide'],
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
    CTA_CANCEL: ['page', 'button', 'activate-project-modal', 'cancel'],
    CTA_CONFIRM: ['page', 'button', 'activate-project-modal', 'confirm'],
  },
};
