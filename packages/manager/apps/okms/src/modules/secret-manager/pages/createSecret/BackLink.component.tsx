import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Links, LinkType } from '@ovh-ux/manager-react-components';
import {
  SECRET_MANAGER_ROUTES_URLS,
  SECRET_MANAGER_SEARCH_PARAMS,
} from '@secret-manager/routes/routes.constants';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHref, useSearchParams } from 'react-router-dom';

export const SecretFormBackLink = () => {
  const { t } = useTranslation([NAMESPACES.ACTIONS]);
  /* okms from the secret list */
  const [searchParams] = useSearchParams();
  const backOkmsId = searchParams.get(SECRET_MANAGER_SEARCH_PARAMS.okmsId);

  const backLink = backOkmsId
    ? useHref(SECRET_MANAGER_ROUTES_URLS.secretList(backOkmsId))
    : useHref(SECRET_MANAGER_ROUTES_URLS.root);

  return (
    <Links
      label={t('back', { ns: NAMESPACES.ACTIONS })}
      type={LinkType.back}
      href={backLink}
    />
  );
};
