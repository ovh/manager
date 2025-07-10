import { DeepReadonly } from '../utils.type';
import { TVisibility } from './common.type';

type TNetworkVisibilityDto = TVisibility;

export type TNetworkDto = DeepReadonly<{
  id: string;
  name: string;
  region: string;
  visibility: TNetworkVisibilityDto;
}>;
