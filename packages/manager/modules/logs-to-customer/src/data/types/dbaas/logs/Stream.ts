import { StreamColdStorageCompressionEnum } from './StreamColdStorageCompressionEnum';
import { StreamColdStorageContentEnum } from './StreamColdStorageContentEnum';
import { StreamColdStorageTargetEnum } from './StreamColdStorageTargetEnum';

/** Graylog stream */
export interface Stream {
  /** Indicates if the current user can create alert on the stream */
  canAlert: boolean;
  /** Cluster ID */
  clusterId: string;
  /** Cold storage compression method */
  coldStorageCompression?: StreamColdStorageCompressionEnum;
  /** ColdStorage content */
  coldStorageContent?: StreamColdStorageContentEnum;
  /** Is Cold storage enabled? */
  coldStorageEnabled?: boolean;
  /** Notify on new Cold storage archive */
  coldStorageNotifyEnabled?: boolean;
  /** Cold storage retention in year */
  coldStorageRetention?: number;
  /** ColdStorage destination */
  coldStorageTarget?: StreamColdStorageTargetEnum;
  /** Stream creation */
  createdAt: string;
  /** Stream description */
  description: string;
  /** Encryption keys used to encrypt stream archives */
  encryptionKeysIds?: string[];
  /** Indexing current size (in bytes) */
  indexingCurrentSize?: number;
  /** Enable ES indexing */
  indexingEnabled?: boolean;
  /** Maximum indexing size (in GB) */
  indexingMaxSize?: number;
  /** If set, notify when size is near 80, 90 or 100 % of the maximum configured setting */
  indexingNotifyEnabled?: boolean;
  /** Indicates if you are allowed to edit entry */
  isEditable: boolean;
  /** Number of alert condition */
  nbAlertCondition: number;
  /** Number of coldstored archives */
  nbArchive: number;
  /** Number of subscriptions targeting this stream */
  nbSubscription: number;
  /** Parent stream ID */
  parentStreamId?: string;
  /** If set, pause indexing when maximum size is reach */
  pauseIndexingOnMaxSize?: boolean;
  /** Retention ID */
  retentionId: string;
  /** Stream ID */
  streamId: string;
  /** Stream description */
  title: string;
  /** Stream last update */
  updatedAt?: string;
  /** Enable Websocket */
  webSocketEnabled?: boolean;
}
