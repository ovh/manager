import {
  AvailabilityPlan,
  AvailabilityProduct,
} from '@datatr-ux/ovhcloud-types/cloud/capabilities';

export type ProductAvailability = {
  plans: AvailabilityPlan[];
  products: AvailabilityProduct[];
};
