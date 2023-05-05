import { startApplication } from '@ovh-ux/manager-react-core-application';
import { useShellClient } from '@ovh-ux/shell';
import { setShellClient } from './shell';

useShellClient('dedicated')
  .then((client) => {
    setShellClient(client);

    return client.environment.getEnvironment();
  })
  .then(() => {
    startApplication('dedicated');
  });
