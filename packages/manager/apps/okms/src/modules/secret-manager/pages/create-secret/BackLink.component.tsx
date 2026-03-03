import { useSearchParams } from 'react-router-dom';

import {
  SECRET_MANAGER_ROUTES_URLS,
  SECRET_MANAGER_SEARCH_PARAMS,
} from '@secret-manager/routes/routes.constants';
import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ButtonType, PageLocation } from '@ovh-ux/manager-react-shell-client';

import { InternalLink, LinkType } from '@/common/components/link/Link.component';
import { useOkmsTracking } from '@/common/hooks/useOkmsTracking';

export const SecretFormBackLink = () => {
  const { t } = useTranslation([NAMESPACES.ACTIONS]);
  const { trackClick } = useOkmsTracking();
  /* okms from the secret list */
  const [searchParams] = useSearchParams();
  const backOkmsId = searchParams.get(SECRET_MANAGER_SEARCH_PARAMS.okmsId);

  const url = backOkmsId
    ? SECRET_MANAGER_ROUTES_URLS.secretList(backOkmsId)
    : SECRET_MANAGER_ROUTES_URLS.root;

  return (
    <InternalLink
      type={LinkType.back}
      to={url}
      onClick={() => {
        trackClick({
          location: PageLocation.funnel,
          buttonType: ButtonType.button,
          actionType: 'action',
          actions: ['cancel'],
        });
      }}
    >
      {t('back', { ns: NAMESPACES.ACTIONS })}
    </InternalLink>
  );
};
