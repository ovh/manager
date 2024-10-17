/** SshKey */
export interface SshKey {
  /** SSH key id */
  id?: string;
  /** SSH key name */
  name?: string;
  /** SSH public key */
  publicKey?: string;
  /** SSH key regions */
  regions?: string[];
}
