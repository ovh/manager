/** Cloud databases kafka topic acl definition */
export interface TopicAcl {
  /** Acl ID */
  id?: string;
  /** Permission to give to this username on this topic. Permissions values can be retrieved using /cloud/project/{serviceName}/database/kafka/{clusterId}/permissions */
  permission: string;
  /** Topic affected by this acl */
  topic: string;
  /** Username affected by this acl */
  username: string;
}
