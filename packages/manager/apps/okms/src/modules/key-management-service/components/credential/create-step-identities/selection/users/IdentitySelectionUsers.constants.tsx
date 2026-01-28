export const IDENTITY_SELECTION_USERS_TEST_IDS = {
  name: (urn: string) => `user-${urn}-name`,
  group: (urn: string) => `user-${urn}-group`,
  status: (urn: string) => `user-${urn}-status`,
  removeButton: (urn: string) => `user-${urn}-remove-button`,
  addButton: 'user-add-button',
  deleteButton: 'user-delete-all-button',
};
