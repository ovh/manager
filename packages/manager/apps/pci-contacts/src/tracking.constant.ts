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
export const SUB_UNIVERSE = 'settings';
export const APP_NAME = 'contacts_rights';

export const CONTACTS_TRACKING = {
  GUIDE: ['page', 'tile-tutorial'],
  CHANGELOG: ['page', 'tile-tutorial'],
  LISTING: {
    ADD_CONTACT: ['page', 'button', 'add_contact'],
    DELETE_CONTACT: ['datagrid', 'button', 'delete_contact'],
    EDIT_ADMIN_CONTACT: ['page', 'button', 'edit_admin-contact'],
    EDIT_BILLING_CONTACT: ['page', 'button', 'edit_billing-contact'],
  },
  ADD: {
    PAGE_NAME: 'add_contact',
    CTA_CANCEL: ['pop-up', 'button', 'add_contact', 'cancel'],
    CTA_CONFIRM: ['pop-up', 'button', 'add_contact', 'confirm'],
    REQUEST_FAIL: 'add_contact_error',
    REQUEST_SUCCESS: 'add_contact_success',
  },
  REMOVE: {
    PAGE_NAME: 'remove_contact',
    CTA_CANCEL: ['pop-up', 'button', 'remove_contact', 'cancel'],
    CTA_CONFIRM: ['pop-up', 'button', 'remove_contact', 'confirm'],
    REQUEST_FAIL: 'remove_contact_error',
    REQUEST_SUCCESS: 'remove_contact_success',
  },
};
