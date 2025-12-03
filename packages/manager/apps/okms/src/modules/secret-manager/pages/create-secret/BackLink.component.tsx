import { useHref, useSearchParams } from 'react-router-dom';

import {
  SECRET_MANAGER_ROUTES_URLS,
  SECRET_MANAGER_SEARCH_PARAMS,
} from '@secret-manager/routes/routes.constants';
import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { LinkType, Links } from '@ovh-ux/manager-react-components';

export const SecretFormBackLink = () => {
  const { t } = useTranslation([NAMESPACES.ACTIONS]);
  /* okms from the secret list */
  const [searchParams] = useSearchParams();
  const backOkmsId = searchParams.get(SECRET_MANAGER_SEARCH_PARAMS.okmsId);

  const url = backOkmsId
    ? SECRET_MANAGER_ROUTES_URLS.secretList(backOkmsId)
    : SECRET_MANAGER_ROUTES_URLS.root;

  const backLink = useHref(url);

  return (
    <Links label={t('back', { ns: NAMESPACES.ACTIONS })} type={LinkType.back} href={backLink} />
  );
};
