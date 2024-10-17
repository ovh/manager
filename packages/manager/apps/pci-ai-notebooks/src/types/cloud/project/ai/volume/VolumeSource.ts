import { DataStore } from '@/types/cloud/project/ai/volume/DataStore';
import { PublicGit } from '@/types/cloud/project/ai/volume/PublicGit';
import { PublicSwift } from '@/types/cloud/project/ai/volume/PublicSwift';
import { Standalone } from '@/types/cloud/project/ai/volume/Standalone';

/** AI Solutions VolumeSource Object. Describes a source (object store) volume */
export interface VolumeSource {
  /** Volume details for data store containers */
  dataStore: DataStore;
  /** Volume details for public git repositories */
  publicGit: PublicGit;
  /** Volume details for public swift containers */
  publicSwift: PublicSwift;
  /** Volume details for volumes that do not have a datasource */
  standalone: Standalone;
}
