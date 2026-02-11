import { OCTAVIA_LOADBALANCER_ADDON_FAMILY } from '@/constants';

export const isOctaviaLoadBalancerPlan = (planCode: string): boolean =>
  planCode.startsWith(`${OCTAVIA_LOADBALANCER_ADDON_FAMILY}.`);
