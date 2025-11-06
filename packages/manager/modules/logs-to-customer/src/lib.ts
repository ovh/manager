import { MODULE_NAME } from '@/LogsToCustomer.constants';
import { type ILogsToCustomerModule, LogsToCustomerModule } from '@/LogsToCustomer.module';
import { type ApiUrls, type LogIamActions } from '@/LogsToCustomer.props';
// Import CSS so it's bundled and available to consuming applications
import '@/components/logTail/logTail.css';
import { LogsToCustomerRoutes, lazyRouteConfig } from '@/routes/routes';

export {
  type ILogsToCustomerModule,
  type ApiUrls,
  type LogIamActions,
  MODULE_NAME,
  lazyRouteConfig,
  LogsToCustomerModule,
  LogsToCustomerRoutes,
};
