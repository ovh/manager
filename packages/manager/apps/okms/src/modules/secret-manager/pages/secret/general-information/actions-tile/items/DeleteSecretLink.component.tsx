import { useHref } from 'react-router-dom';

import { useOkmsById } from '@key-management-service/data/hooks/useOkms';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { Secret } from '@secret-manager/types/secret.type';
import { useTranslation } from 'react-i18next';

import { Skeleton } from '@ovhcloud/ods-react';

import { ButtonType, PageLocation } from '@ovh-ux/manager-react-shell-client';

import { MukLink } from '@/common/components/link/Link.component';
import { useOkmsTracking } from '@/common/hooks/useOkmsTracking';
import { useRequiredParams } from '@/common/hooks/useRequiredParams';
import { kmsIamActions } from '@/common/utils/iam/iam.constants';
import { isOkmsActive } from '@/common/utils/okms/isOkmsActive';

export const DELETE_SECRET_TEST_IDS = {
  skeleton: 'skeleton',
  deleteSecretLink: 'delete-secret-link',
};

type DeleteSecretLinkProps = {
  secret: Secret;
};

export const DeleteSecretLink = ({ secret }: DeleteSecretLinkProps) => {
  const { okmsId } = useRequiredParams('okmsId');
  const { t } = useTranslation('secret-manager');
  const { trackClick } = useOkmsTracking();
  const href = useHref(SECRET_MANAGER_ROUTES_URLS.secretDeleteSecret(okmsId, secret.path));

  const { data: okms, isPending } = useOkmsById(okmsId);

  if (isPending) return <Skeleton data-testid={DELETE_SECRET_TEST_IDS.skeleton} />;

  return (
    <MukLink
      data-testid={DELETE_SECRET_TEST_IDS.deleteSecretLink}
      href={href}
      disabled={!isOkmsActive(okms)}
      onClick={() => {
        trackClick({
          location: PageLocation.tile,
          buttonType: ButtonType.button,
          actionType: 'action',
          actions: ['delete', 'secret'],
        });
      }}
      urn={okms?.iam?.urn}
      iamActions={[kmsIamActions.secretDelete]}
    >
      {t('delete_secret')}
    </MukLink>
  );
};
