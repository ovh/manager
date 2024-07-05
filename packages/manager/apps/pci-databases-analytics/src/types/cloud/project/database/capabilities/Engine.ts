import { CategoryEnum } from '@/types/cloud/project/database/engine/CategoryEnum';
import { StrategyEnum } from '@/types/cloud/project/database/capabilities/engine/storage/StrategyEnum';

/** Specific database engine capability */
export interface Engine {
  /** Category of the engine */
  category?: CategoryEnum;
  /** Default version used for the engine */
  defaultVersion?: string;
  /** Description of the engine */
  description?: string;
  /** Engine name */
  name?: string;
  /** SSL modes for this engine */
  sslModes?: string[];
  /** Storage strategy of the engine */
  storage?: StrategyEnum;
  /** Versions available for this engine */
  versions?: string[];
}
