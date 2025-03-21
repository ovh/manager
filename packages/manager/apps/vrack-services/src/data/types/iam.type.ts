export type IAMResource = {
  displayName: string;
  id: string;
  name: string;
  owner: string;
  /**
   * Resource tags. Tags that were internally computed are prefixed with ovh
   */
  tags?: Record<string, string> | null;
  /**
   * Resource type. All types can be retrieved at /reference/resource/type
   */
  type: string;
  /**
   * Unique resource name used in policies
   */
  urn: string;
};
