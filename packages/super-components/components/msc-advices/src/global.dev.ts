import './global';
import '@ovhcloud/ods-components/text';
import '@ovhcloud/ods-components/skeleton';
import '@ovhcloud/ods-components/divider';
import '@ovhcloud/ods-components/tile';
import '@ovhcloud/ods-components/icon';
import { setupWorker } from 'msw';
import handlers from '../mock/handlers';

await setupWorker(...handlers).start({
  onUnhandledRequest: 'bypass',
  // Remove quiet option to see which handlers are successfully registred
  quiet: true,
});
