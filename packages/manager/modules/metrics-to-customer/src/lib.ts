import { IMetricsToCustomerModule } from '@/IMetricsToCustomerModule.interface';
import { MetricsToCustomerModule } from '@/MetricsToCustomer.module';
import { NAMESPACES } from '@/MetricsToCustomer.translations';
import { MetricsToCustomerRoutes, getMetricsToCustomerRoutes } from '@/routes/routes';

export {
  type IMetricsToCustomerModule,
  NAMESPACES as METRICS_TO_CUSTOMER_NAMESPACES,
  MetricsToCustomerModule,
  MetricsToCustomerRoutes,
  getMetricsToCustomerRoutes as getMetricsRoute,
};
