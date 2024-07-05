/** Opensearch user acl definition */
export interface UserAcl {
  /** Pattern of the ACL */
  pattern: string;
  /** Permission of the ACL */
  permission: string;
}
