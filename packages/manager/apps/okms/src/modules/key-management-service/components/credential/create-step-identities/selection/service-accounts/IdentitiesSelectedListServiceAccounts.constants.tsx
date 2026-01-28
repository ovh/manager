export const IDENTITY_SELECTION_SERVICE_ACCOUNTS_TEST_IDS = {
  name: (urn: string | null) => `service-account-${urn}-name`,
  identity: (urn: string | null) => `service-account-${urn}-identity`,
  removeButton: (urn: string | null) => `service-account-${urn}-remove-button`,
  addButton: 'service-account-add-button',
  deleteButton: 'service-account-delete-all-button',
};
