import { OperationStateEnum } from './OperationStateEnum';

/** Asynchronous operation */
export interface Operation {
  /** Alias used */
  aliasId?: string;
  /** Operation creation */
  createdAt: string;
  /** Dashboard used */
  dashboardId?: string;
  /** Encryption key used */
  encryptionKeyId?: string;
  /** Index used */
  indexId?: string;
  /** Input used */
  inputId?: string;
  /** Operation ID */
  operationId: string;
  /** OpenSearch Dashboards used */
  osdId?: string;
  /** Role used */
  roleId?: string;
  /** Service name */
  serviceName: string;
  /** Operation status */
  state: OperationStateEnum;
  /** Stream used */
  streamId?: string;
  /** Subscription used */
  subscriptionId?: string;
  /** Metrics tenant used */
  tenantId?: string;
  /** Token used */
  tokenId?: string;
  /** Operation last update */
  updatedAt?: string;
}
