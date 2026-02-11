import { resizeLoadBalancerFlavor } from '@/data/api/loadBalancerFlavor.api';
import { TLoadBalancerFlavorPort } from '@/domain/port/loadBalancer/port';

export const loadBalancerFlavorAdapter: TLoadBalancerFlavorPort = {
  resizeFlavor: resizeLoadBalancerFlavor,
};
