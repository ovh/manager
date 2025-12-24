import React, { useContext } from 'react';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { Error } from '@ovh-ux/muk';

const NotFound = () => {
  const navigation = useContext(ShellContext).shell.navigation;

  const navigateToHomePage = () => {
    void navigation.navigateTo('public-cloud', '', {});
  };

  const reloadPage = () => {
    void navigation.reload();
  };

  return (
    <Error
      error={{
        status: 404,
      }}
      onReloadPage={reloadPage}
      onRedirectHome={navigateToHomePage}
    />
  );
};

export default NotFound;
