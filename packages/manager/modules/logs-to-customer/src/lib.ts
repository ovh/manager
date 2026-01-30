import { MODULE_NAME } from '@/LogsToCustomer.constants';
import { type ILogsToCustomerModule, LogsToCustomerModule } from '@/LogsToCustomer.module';
import { type ApiUrls, type LogIamActions } from '@/LogsToCustomer.props';
import '@/index.css';
import { LogsToCustomerRoutes, lazyRouteConfig } from '@/routes/routes';

import { NAMESPACES } from './LogsToCustomer.translations';

export {
  type ILogsToCustomerModule,
  type ApiUrls,
  type LogIamActions,
  MODULE_NAME,
  NAMESPACES as LOGS_TO_CUSTOMER_NAMESPACES,
  lazyRouteConfig,
  LogsToCustomerModule,
  LogsToCustomerRoutes,
};
