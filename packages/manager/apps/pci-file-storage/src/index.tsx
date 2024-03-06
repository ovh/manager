import { startApplication } from '@ovh-ux/manager-react-core-application';
import { initShellClient } from '@ovh-ux/shell';
import { setShellClient } from './shell';
import '@ovhcloud/ods-theme-blue-jeans/dist/index.css';
import './index.scss';
import './global.css';

initShellClient('pci-file-storage')
  .then((client) => {
    return setShellClient(client);
  })
  .then(() => {
    startApplication('pci-file-storage');
  });
