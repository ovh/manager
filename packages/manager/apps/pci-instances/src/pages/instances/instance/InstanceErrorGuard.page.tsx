import { mapUnknownErrorToBannerError } from '@/utils';
import { ErrorBanner } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { FC, PropsWithChildren, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const InstanceErrorGuard: FC<PropsWithChildren<{ error: Error | null }>> = ({
  children,
  error,
}) => {
  const nav = useContext(ShellContext).shell.navigation;
  const errorMessage = mapUnknownErrorToBannerError(error);
  const navigate = useNavigate();

  const navigateToListingPage = () => {
    navigate('..');
  };

  const reloadPage = () => {
    nav.reload();
  };

  if (error)
    return (
      <ErrorBanner
        onReloadPage={reloadPage}
        onRedirectHome={navigateToListingPage}
        error={errorMessage}
      />
    );

  return children;
};

export default InstanceErrorGuard;
