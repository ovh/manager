import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { BILLING_REDIRECTIONS, CATALOG_URL_REGEX } from '@/hub.constants';

export default function NotFound() {
  const { shell } = useContext(ShellContext);

  const hash = window.location.hash.replace('#', '');
  for (let index = 0; index < BILLING_REDIRECTIONS.length; index += 1) {
    const redirectionRegex = BILLING_REDIRECTIONS[index];
    if (redirectionRegex.test(hash)) {
      shell.navigation
        .getURL('dedicated', window.location.hash, {})
        .then((url: string) => {
          window.top.location.href = url;
        });
    }
  }
  if (CATALOG_URL_REGEX.test(hash)) {
    shell.navigation.getURL('catalog', '/', {}).then((url: string) => {
      window.top.location.href = url;
    });
    return null;
  }

  return <Navigate to={'/'} />;
}
