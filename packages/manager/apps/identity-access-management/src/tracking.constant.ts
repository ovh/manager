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
  }
}
