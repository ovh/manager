/** AI Solutions data store auth */
export interface DataStoreAuth {
  /** Access key to the datastore */
  accessKey?: string;
  /** Region of the datastore */
  region?: string;
  /** S3 Url of the datastore */
  s3Url?: string;
  /** Secret key to the datastore */
  secretKey?: string;
  /** Swift (or S3) Auth token */
  token?: string;
  /** Swift storage URL */
  url?: string;
}
