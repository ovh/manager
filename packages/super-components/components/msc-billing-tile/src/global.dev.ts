import './global';
import '@ovhcloud/ods-stencil/components/tile';
import '@ovhcloud/ods-stencil/components/button';
import '@ovhcloud/ods-stencil/components/skeleton';
import '@ovhcloud/ods-stencil/components/link';
import '@ovhcloud/ods-stencil/components/text';
import '@ovhcloud/ods-stencil/components/chip';
import '@ovhcloud/ods-stencil/components/divider';
import '@ovhcloud/ods-stencil/components/icon';
import { setupWorker } from 'msw';
import handlers from '../mock/handlers';

await setupWorker(...handlers).start({
  onUnhandledRequest: 'bypass',
  // Remove quiet option to see which handlers are successfully registred
  quiet: true,
});
