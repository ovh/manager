import { DataStore } from '@/types/cloud/project/ai/volume/DataStore';

/** AI Solutions VolumeTarget Object. Describes a target (object store) volume */
export interface VolumeTarget {
  /** Volume details for data store containers */
  targetDataStore: DataStore;
}
