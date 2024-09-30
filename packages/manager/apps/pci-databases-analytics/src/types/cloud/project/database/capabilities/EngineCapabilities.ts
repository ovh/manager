import { CategoryEnum } from '@/types/cloud/project/database/engine/CategoryEnum';
import { StrategyEnum } from '@/types/cloud/project/database/capabilities/engine/storage/StrategyEnum';
import { Lifecycle } from '@/types/cloud/project/database/availability/Lifecycle';
import { TagEnum } from '@/types/cloud/project/database/capabilities/TagEnum';

/** Engines Capabilites */
export interface EngineCapabilities {
  category: CategoryEnum;
  description: string;
  lifecycle: Lifecycle;
  name: string;
  order: number;
  sslModes: string[];
  storage: StrategyEnum;
  tags: TagEnum[];
  versions: {
    default: boolean;
    lifecycle: Lifecycle;
    name: string;
    tags: TagEnum[];
  }[];
}
