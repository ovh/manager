import {
  ErrorBanner,
  ErrorBannerProps,
} from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { FC, useContext } from 'react';
import { useTranslation } from 'react-i18next';

const NotFound: FC = () => {
  const { t } = useTranslation('common');
  const nav = useContext(ShellContext).shell.navigation;
  const redirectionApplication = 'public-cloud';
  const notFoundError: ErrorBannerProps['error'] = {
    status: 404,
    data: {
      message: t('pci_instances_common_404_error_message'),
    },
  };

  const navigateToHomePage = () => {
    nav.navigateTo(redirectionApplication, '', {});
  };

  const reloadPage = () => {
    nav.reload();
  };

  return (
    <ErrorBanner
      onReloadPage={reloadPage}
      onRedirectHome={navigateToHomePage}
      error={notFoundError}
    />
  );
};

export default NotFound;
