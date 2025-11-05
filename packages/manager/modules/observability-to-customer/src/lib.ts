import { ObservabilityToCustomerModule } from '@/ObservabilityToCustomer.module';
import { NAMESPACES } from '@/ObservabilityToCustomer.translations';
import { DashboardContext } from '@/contexts/Dashboard.context';
import { getObservabilityRoute, observabilityRoutes } from '@/routes/routes';

export {
  ObservabilityToCustomerModule,
  DashboardContext,
  observabilityRoutes,
  getObservabilityRoute,
  NAMESPACES as OBSERVABILITY_TO_CUSTOMER_NAMESPACES,
};

export default {
  ObservabilityToCustomerModule,
  observabilityRoutes,
  getObservabilityRoute,
  DashboardContext,
  OBSERVABILITY_TO_CUSTOMER_NAMESPACES: NAMESPACES,
};
