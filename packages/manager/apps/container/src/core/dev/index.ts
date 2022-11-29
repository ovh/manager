import { Shell } from '@ovh-ux/shell';
import { Application } from '@ovh-ux/manager-config';

export function setupDevApplication(shell: Shell) {
  if (import.meta.env.DEV) {
    const devApp = import.meta.env.VITE_CONTAINER_APP;
    const apps = shell
      .getPlugin('environment')
      .getEnvironment()
      .getApplications();

    if (!devApp) {
      throw new Error('Missing environment variable env.VITE_CONTAINER_APP');
    }

    // disable container for all applications
    Object.entries(apps).forEach(([, appConfig]) => {
      const conf = appConfig as Application;
      conf.container.isDefault = false;
      conf.container.enabled = false;
    });

    // enable the container only for the current dev application
    const containerApp = apps[devApp];

    if (!containerApp) {
      throw new Error(`Application not found: '${devApp}'`);
    }

    containerApp.container.enabled = true;
    containerApp.container.isDefault = true;
    containerApp.url = `${window.location.origin}/app`;
  }
}

export default { setupDevApplication };
