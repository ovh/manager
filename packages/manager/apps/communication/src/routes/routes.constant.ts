export const urls = {
  root: '/',
  // Dashboard Layout
  CommunicationsTab: '/',
  CommunicationsDetail: '/:notificationId',
  CommunicationsDetailTo: (notificationId: string) => `/${notificationId}`,
  ContactsTab: '/contacts',
  SettingsTab: '/settings',
};
