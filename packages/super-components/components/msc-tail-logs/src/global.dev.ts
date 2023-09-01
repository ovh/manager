import './global';
import '@ovhcloud/ods-stencil/components/text';
import '@ovhcloud/ods-stencil/components/skeleton';
import '@ovhcloud/ods-stencil/components/code';
import '@ovhcloud/ods-stencil/components/toggle';
import { setupWorker } from 'msw';
import handlers from '../mock/handlers';

await setupWorker(...handlers).start({
  onUnhandledRequest: 'bypass',
});
