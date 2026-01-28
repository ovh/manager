export const IDENTITIES_BASE_TILE_TEST_IDS = {
  user: (urn: string) => `user-tile-${urn}`,
  group: (urn: string) => `group-tile-${urn}`,
  serviceAccount: (urn: string | null) => `service-account-tile-${urn}`,
};
