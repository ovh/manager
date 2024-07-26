/** Cloud databases kafka schema registry acl definition */
export interface SchemaRegistryAcl {
  /** Acl ID */
  id?: string;
  /** Permission to give to this username on this resource. Permissions values can be retrieved using /cloud/project/{serviceName}/database/kafka/{clusterId}/permissions */
  permission: string;
  /** Resource affected by this acl */
  resource: string;
  /** Username affected by this acl */
  username: string;
}
