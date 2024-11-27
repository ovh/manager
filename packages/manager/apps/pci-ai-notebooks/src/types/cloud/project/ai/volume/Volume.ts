import { DataStore } from '@/types/cloud/project/ai/volume/DataStore';
import { VolumePermissionEnum } from '@/types/cloud/project/ai/VolumePermissionEnum';
import { PublicGit } from '@/types/cloud/project/ai/volume/PublicGit';
import { PublicSwift } from '@/types/cloud/project/ai/volume/PublicSwift';
import { Standalone } from '@/types/cloud/project/ai/volume/Standalone';
import { VolumeSource } from '@/types/cloud/project/ai/volume/VolumeSource';
import { VolumeTarget } from '@/types/cloud/project/ai/volume/VolumeTarget';

/** AI Solutions Volume Object */
export interface Volume {
  /** Enable/disable volume caching */
  cache: boolean;
  /** Public Cloud Storage container to attach */
  container?: string;
  /** @deprecated Volume details for data store containers. Deprecated: Use volumeSource.dataStore instead */
  dataStore?: DataStore;
  /** @deprecated Volume Id. Deprecated: moved to status.volumes[] */
  id?: string;
  /** Path where to mount the data inside the container */
  mountPath: string;
  /** Permissions to use on the mounted volume */
  permission: VolumePermissionEnum;
  /** Prefix to fetch only part of the volume */
  prefix?: string;
  /** @deprecated Volume details for public git repositories. Deprecated: Use volumeSource.publicGit instead */
  publicGit?: PublicGit;
  /** @deprecated Volume details for public swift containers. Deprecated: Use volumeSource.publicSwift instead */
  publicSwift?: PublicSwift;
  /** Public Cloud Storage Region */
  region?: string;
  /** @deprecated Volume details for volumes that do not have a datasource. Deprecated: Use volumeSource.standalone instead */
  standalone?: Standalone;
  /** @deprecated Target volume details for data store containers. Deprecated: Use volumeTarget.targetDataStore instead */
  targetDataStore?: DataStore;
  /** Source volume details */
  volumeSource?: VolumeSource;
  /** Target volume details */
  volumeTarget?: VolumeTarget;
}
