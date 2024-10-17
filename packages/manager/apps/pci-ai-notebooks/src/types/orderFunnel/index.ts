import { order } from '../catalog';
import * as ai from '@/types/cloud/project/ai';

export interface Flavor extends ai.capabilities.Flavor {
  pricing: order.publicOrder.Pricing[];
}

export interface FrameworkWithVersion {
  framework: string;
  version: string;
}
