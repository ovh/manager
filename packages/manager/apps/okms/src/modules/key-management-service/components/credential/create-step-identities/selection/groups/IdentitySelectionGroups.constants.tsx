export const IDENTITY_SELECTION_GROUP_TEST_IDS = {
  name: (urn: string) => `group-${urn}-name`,
  description: (urn: string) => `group-${urn}-description`,
  identity: (urn: string) => `group-${urn}-identity`,
  removeButton: (urn: string) => `group-${urn}-remove-button`,
  addButton: 'group-add-button',
  deleteButton: 'group-delete-all-button',
};
