/* eslint-disable @typescript-eslint/ban-ts-comment */
import { startApplication } from '@ovh-ux/manager-react-core-application';
import { initShellClient } from '@ovh-ux/shell';
import { setupWorker } from 'msw';
import { setShellClient } from './shell';
import { getHandlers } from '../mock/handlers';
import '@ovhcloud/ods-theme-blue-jeans/dist/index.css';
import './index.scss';
import './global.css';

const mockApiIfDev = async () => {
  if (process.env.NODE_ENV === 'development') {
    // @ts-ignore
    await setupWorker(...getHandlers({ nbVs: 2 })).start({
      onUnhandledRequest: 'bypass',
    });
  }
};

mockApiIfDev()
  .then(() => initShellClient('vrack-services'))
  .then((client) => setShellClient(client))
  .then(() => startApplication('vrack-services'));
