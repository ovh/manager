export const urls = {
  root: '/',
  // Dashboard Layout
  CommunicationsTab: '/',
  CommunicationsDetail: '/:notificationId',
  CommunicationsDetailTo: (notificationId: string) => `/${notificationId}`,
  ContactsTab: '/contacts',
  contactsAdd: '/contacts/create',
  contactsEdit: '/contacts/:contactMeanId/edit',
  contactsValidate: '/contacts/:contactMeanId/validate',
  contactsDelete: '/contacts/:contactMeanId/delete',
  ContactsEditTo: (contactMeanId: string) => `/contacts/${contactMeanId}/edit`,
  ContactsDeleteTo: (contactMeanId: string) =>
    `/contacts/${contactMeanId}/delete`,
  ContactsValidateTo: (contactMeanId: string) =>
    `/contacts/${contactMeanId}/validate`,
  SettingsTab: '/settings',
};
