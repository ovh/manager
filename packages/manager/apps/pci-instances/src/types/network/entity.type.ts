import { DeepReadonly } from '../utils.type';
import { TVisibility } from './common.type';

type TNetworkVisibility = TVisibility;

export type TNetwork = DeepReadonly<{
  id: string;
  name: string;
  region: string;
  visibility: TNetworkVisibility;
}>;
