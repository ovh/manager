import { TResizeLoadBalancerFlavorDTO } from '@/adapters/tanstack/loadBalancerFlavor/right/dto.type';

export type TLoadBalancerFlavorPort = {
  resizeFlavor: (args: {
    projectId: string;
    region: string;
    loadBalancerId: string;
    flavor: TResizeLoadBalancerFlavorDTO;
  }) => Promise<void>;
};
