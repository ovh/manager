import { order } from '../catalog';
import * as ai from '@/types/cloud/project/ai';
import * as storage from '@/types/cloud/storage';

export interface Flavor extends ai.capabilities.Flavor {
  pricing: order.publicOrder.Pricing[];
}

export interface FrameworkWithVersion {
  framework: string;
  version: string;
}

export interface OrderSshKey {
  name: string;
  sshKey: string;
}
