import { startApplication } from '@ovh-ux/manager-react-core-application';
import { initShellClient } from '@ovh-ux/shell';
import { setupWorker } from 'msw/browser';
import { setShellClient } from './shell';
import { getMswHandlers } from '../mock/handlers';
import '@ovhcloud/ods-theme-blue-jeans/dist/index.css';
import './index.scss';
import './global.css';

const mockApiIfDev = async () => {
  if (window.location.href.includes('localhost:9001')) {
    await setupWorker(
      ...getMswHandlers({
        nbVs: 5,
        deliveringVrackServicesOrders: true,
      }),
    ).start({
      onUnhandledRequest: 'bypass',
    });
  }
};

mockApiIfDev()
  .then(() => initShellClient('vrack-services'))
  .then((client) => setShellClient(client))
  .then(() => startApplication('vrack-services'));
