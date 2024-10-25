import { Retention } from '@/types/cloud/project/database/m3db/namespace/Retention';
import { TypeEnum } from '@/types/cloud/project/database/m3db/namespace/TypeEnum';

/** M3db Namespace creation definition */
export interface NamespaceCreation {
  /** Namespace ID */
  id?: string;
  /** Name of the namespace */
  name: string;
  /** Resolution for an aggregated namespace */
  resolution?: string;
  /** Retention configuration */
  retention: Retention;
  /** Defines whether M3db will create snapshot files for this namespace */
  snapshotEnabled: boolean;
  /** Type of namespace */
  type: TypeEnum;
  /** Defines whether M3db will include writes to this namespace in the commit log */
  writesToCommitLogEnabled: boolean;
}
