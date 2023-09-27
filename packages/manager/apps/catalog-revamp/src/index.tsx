import { startApplication } from '@ovh-ux/manager-react-core-application';
import { initShellClient } from '@ovh-ux/shell';
import { setShellClient } from './shell';
import 'bootstrap/scss/bootstrap-utilities.scss';
import '@ovhcloud/ods-theme-blue-jeans/index.css';

initShellClient('catalog-revamp')
  .then((client) => {
    return setShellClient(client);
  })
  .then(() => {
    startApplication('catalog-revamp');
  });
