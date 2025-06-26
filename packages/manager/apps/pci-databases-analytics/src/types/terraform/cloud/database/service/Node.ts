/** Opensearch user acl definition */
export interface Node {
  /** A valid OVHcloud public cloud database flavor name in which the nodes will be started. */
  flavor: string;
  /** Public cloud region in which the node should be deployed. */
  region: string;
}
