import { Shell } from '@ovh-ux/shell';
import { Application } from '@ovh-ux/manager-config';

export function setupDevApplication(shell: Shell) {
  if (import.meta.env.DEV) {
    const devApp = import.meta.env.VITE_CONTAINER_APP;
    const defaultApps = shell
      .getPlugin('environment')
      .getEnvironment()
      .getApplications();
    const aiToolsApp = {
      'pci-ai-tools': {
        container: defaultApps['pci-databases-analytics'].container,
        publicURL: "https://www.ovh.com/manager/#/public-cloud",
        universe: "public-cloud",
        url: "https://www.ovh.com/manager/pci-ai-tools/"
      }
    };
    const apps = {
      ...defaultApps,
      ...aiToolsApp
    }; 

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
    let containerApp = apps[devApp];

    // if the application configuration doesn't exist in DEV mode
    // then it's a new application, create a default configuration to use
    if (!containerApp) {
      const devConfig = {
        universe: 'dedicated',
        url: `https://www.ovh.com/manager/${devApp}/`,
        publicURL: `https://www.ovh.com/manager/#/${devApp}/`,
        container: {
          enabled: true,
          isDefault: true,
          path: devApp,
          hash: '',
        },
      };
      if (devApp.indexOf('pci-') > -1) {
        devConfig.container.hash = `/pci/projects/:projectId/${
          devApp.split('pci-')[1]
        }`;
        devConfig.container.path = 'public-cloud';
      }
      apps[devApp] = devConfig;
      containerApp = devConfig;
      // eslint-disable-next-line no-console
      console.error(
        `Application '${devApp}' doesn't exist in 2API configuration.`,
      );
    }

    containerApp.container.enabled = true;
    containerApp.container.isDefault = true;
    containerApp.url = `${window.location.origin}/app`;
  }
}

export default { setupDevApplication };
