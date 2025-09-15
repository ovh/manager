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
  ContactsEditTo: (contactMeanId: string) => `/contacts/${contactMeanId}/edit`,
  ContactsValidateTo: (contactMeanId: string) =>
    `/contacts/${contactMeanId}/validate`,
  SettingsTab: '/settings',
};
