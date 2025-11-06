export const OKMS_LIST_CELL_TEST_IDS = {
  id: (id: string) => `okms-list-cell-${id}-id`,
  name: (id: string) => `okms-list-cell-${id}-name`,
  region: (id: string) => `okms-list-cell-${id}-region`,
  status: (id: string) => `okms-list-cell-${id}-status`,
  kmipCount: (id: string) => `okms-list-cell-${id}-kmip-count`,
  serviceKeyCount: (id: string) => `okms-list-cell-${id}-service-key-count`,
  secretCount: (id: string) => `okms-list-cell-${id}-secret-count`,
};
