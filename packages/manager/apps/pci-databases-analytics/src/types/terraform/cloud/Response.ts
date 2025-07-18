/** Cloud databases cluster definition */
export interface Response {
  /** Datasource Terraform block */
  datasource?: string;
  /** Import terraform command */
  import?: string;
  /** Resource terraform block */
  resource?: string;
}
