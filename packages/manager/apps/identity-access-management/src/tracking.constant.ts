export const LEVEL2 = {
  EU: {
    config: {
      level2: '81',
    },
  },
  CA: {
    config: {
      level2: '81',
    },
  },
  US: {
    config: {
      level2: '81',
    },
  },
};

export const UNIVERSE = 'Manager';
export const SUB_UNIVERSE = 'Manager';
export const PAGE_CHAPTER_1 = 'identity-security-operation';
export const PAGE_CHAPTER_2 = 'identity-access-management';
export const APP_NAME = 'identity-access-management';

export enum TrackPageName {
  TAG_MANAGEMENT = 'tag-management',
  TAG_MANAGEMENT_ASSIGN_TAG = 'tag-management_assign-tag',
  TAG_MANAGEMENT_TAG_DETAIL = 'tag-management_tag-detail',
  TAG_MANAGEMENT_UNASSIGN_TAG = 'tag-management_unassign-tag',
}

export const PERMANENT_TOKENS_TRACKING = {
  LISTING: {
    PAGE_NAME: 'list_tokens',
    GO_BACK: ['page', 'button', 'go_back_to_identities'],
    ADD_TOKEN: ['page', 'button', 'add_token'],
    EDIT_TOKEN: ['datagrid', 'button', 'edit_token'],
    DELETE_TOKEN: ['datagrid', 'button', 'delete_token'],
  },
  ADD: {
    PAGE_NAME: 'add_token',
    CTA_CANCEL: ['pop-up', 'button', 'add_token', 'cancel'],
    CTA_CONFIRM: ['pop-up', 'button', 'add_token', 'confirm'],
    REQUEST_FAIL: 'add_token_error',
    REQUEST_SUCCESS: 'add_token_success',
  },
  VIEWER: {
    PAGE_NAME: 'show_token',
    CTA_CLOSE: ['pop-up', 'button', 'show_token', 'close'],
  },
  EDIT: {
    PAGE_NAME: 'edit_token',
    CTA_CANCEL: ['pop-up', 'button', 'edit_token', 'cancel'],
    CTA_CONFIRM: ['pop-up', 'button', 'edit_token', 'confirm'],
    REQUEST_FAIL: 'edit_token_error',
    REQUEST_SUCCESS: 'edit_token_success',
  },
  DELETE: {
    PAGE_NAME: 'delete_token',
    CTA_CANCEL: ['pop-up', 'button', 'delete_token', 'cancel'],
    CTA_CONFIRM: ['pop-up', 'button', 'delete_token', 'confirm'],
    REQUEST_FAIL: 'delete_token_error',
    REQUEST_SUCCESS: 'delete_token_success',
  },
};

export const SERVICE_ACCOUNTS_TRACKING = {
  LISTING: {
    PAGE_NAME: 'list_service-accounts',
    ADD_ACCOUNT: ['page', 'button', 'add_account'],
    EDIT_ACCOUNT: ['datagrid', 'button', 'edit_account'],
    DELETE_ACCOUNT: ['datagrid', 'button', 'delete_account'],
  },
  ADD: {
    PAGE_NAME: 'add_service-account',
    CTA_CANCEL: ['pop-up', 'button', 'add_account', 'cancel'],
    CTA_CONFIRM: ['pop-up', 'button', 'add_account', 'confirm'],
    REQUEST_FAIL: 'add_account_error',
    REQUEST_SUCCESS: 'add_account_success',
  },
  VIEWER: {
    PAGE_NAME: 'show_service-account',
    CTA_CLOSE: ['pop-up', 'button', 'show_account', 'close'],
  },
  EDIT: {
    PAGE_NAME: 'edit_service-account',
    CTA_CANCEL: ['pop-up', 'button', 'edit_account', 'cancel'],
    CTA_CONFIRM: ['pop-up', 'button', 'edit_account', 'confirm'],
    REQUEST_FAIL: 'edit_account_error',
    REQUEST_SUCCESS: 'edit_account_success',
  },
  DELETE: {
    PAGE_NAME: 'delete_service-account',
    CTA_CANCEL: ['pop-up', 'button', 'delete_account', 'cancel'],
    CTA_CONFIRM: ['pop-up', 'button', 'delete_account', 'confirm'],
    REQUEST_FAIL: 'delete_account_error',
    REQUEST_SUCCESS: 'delete_account_success',
  },
};
