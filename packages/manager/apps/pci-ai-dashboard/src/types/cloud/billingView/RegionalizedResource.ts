import { Component } from '@/types/cloud/billingView/Component';

/** RegionalizedResource */
export interface RegionalizedResource {
  /** List of components */
  components?: Component[];
  /** Region of the resource */
  region?: string;
}
