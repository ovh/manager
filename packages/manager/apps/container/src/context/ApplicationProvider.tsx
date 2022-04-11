import React, { useContext } from 'react';

import { Environment } from '@ovh-ux/manager-config';
import Shell from '@ovh-ux/shell';
import PropTypes from 'prop-types';

import ApplicationContext from './application.context';
import { HeaderProvider } from './header';

type Props = {
  children: JSX.Element;
  environment: Environment;
  shell: Shell;
};

export const ApplicationProvider = ({
  children,
  environment,
  shell,
}: Props): JSX.Element => {
  let applicationContext = useContext(ApplicationContext);

  applicationContext = {
    environment,
    shell,
  };

  return (
    <ApplicationContext.Provider value={applicationContext}>
      <HeaderProvider>{children}</HeaderProvider>
    </ApplicationContext.Provider>
  );
};

ApplicationProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  environment: PropTypes.object,
  shell: PropTypes.object,
};

ApplicationProvider.defaultProps = {
  children: null,
  environment: {},
  shell: {},
};

export default ApplicationProvider;
