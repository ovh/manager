import './global';
import '@ovhcloud/ods-components/text';
import '@ovhcloud/ods-components/skeleton';
import '@ovhcloud/ods-components/code';
import '@ovhcloud/ods-components/toggle';
import { setupWorker } from 'msw';
import handlers from '../mock/handlers';

await setupWorker(...handlers).start({
  onUnhandledRequest: 'bypass',
});
