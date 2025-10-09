import {
  AvailabilityPlan,
  AvailabilityProduct,
} from '@datatr-ux/ovhcloud-types/cloud/capabilities/index';

export type ProductAvailability = {
  plans: AvailabilityPlan[];
  products: AvailabilityProduct[];
};
