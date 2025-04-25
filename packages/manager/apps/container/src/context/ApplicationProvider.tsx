import { Environment } from '@ovh-ux/manager-config';
import { Shell } from '@ovh-ux/shell';

import ApplicationContext from './application.context';
import { HeaderProvider } from './header';

type Props = {
  children: JSX.Element;
  environment: Environment;
  shell: Shell;
};

export const ApplicationProvider = ({
  children = null,
  environment = {} as Environment,
  shell = {} as Shell,
}: Props): JSX.Element => {
  return (
    <ApplicationContext.Provider
      value={{
        environment,
        shell,
      }}
    >
      <HeaderProvider>{children}</HeaderProvider>
    </ApplicationContext.Provider>
  );
};

export default ApplicationProvider;
