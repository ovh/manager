import { useCallback } from 'react';

import { ShellContextType } from '@ovh-ux/manager-react-shell-client';

type UseRedirectionHelperParams = {
  isRedirectExternal: boolean;
  redirectExternalUrl: string;
  redirectPath: string;
  redirectParams: Record<string, string>;
  navigation: ShellContextType['shell']['navigation'];
};

export const useRedirectionHelper = ({
  isRedirectExternal,
  redirectExternalUrl,
  redirectPath,
  redirectParams,
  navigation,
}: UseRedirectionHelperParams) => {
  const redirect = useCallback(
    (projectId: string) => {
      if (isRedirectExternal) {
        (window.top || window).location.assign(
          redirectExternalUrl.replace(/:projectId/g, projectId),
        );
      } else {
        navigation.navigateTo('public-cloud', redirectPath, {
          ...redirectParams,
          projectId,
        });
      }
    },
    [isRedirectExternal, redirectExternalUrl, redirectPath, redirectParams, navigation],
  );

  const redirectUrl = useCallback(
    async (projectId: string): Promise<string> => {
      if (isRedirectExternal) {
        return Promise.resolve(redirectExternalUrl.replace(/:projectId/g, projectId));
      }
      return navigation
        .getURL('public-cloud', redirectPath, {
          ...redirectParams,
          projectId,
        })
        .then((url: unknown) => url as string);
    },
    [isRedirectExternal, redirectExternalUrl, redirectPath, redirectParams, navigation],
  );

  return { redirect, redirectUrl };
};
