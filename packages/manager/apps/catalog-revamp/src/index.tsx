import { startApplication } from '@ovh-ux/manager-react-core-application';
import { initShellClient } from '@ovh-ux/shell';
import { setShellClient } from './shell';
import '@ovhcloud/ods-theme-blue-jeans/dist/index.css';
import './global.scss';

initShellClient('catalog-revamp')
  .then((client) => {
    return setShellClient(client);
  })
  .then(() => {
    startApplication('catalog-revamp');
  });
