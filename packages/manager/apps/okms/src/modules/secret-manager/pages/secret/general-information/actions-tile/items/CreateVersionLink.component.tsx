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

export const CREATE_VERSION_TEST_IDS = {
  skeleton: 'skeleton',
  createVersionLink: 'create-version-link',
};

type CreateVersionLinkProps = {
  secret: Secret;
};

export const CreateVersionLink = ({ secret }: CreateVersionLinkProps) => {
  const { okmsId } = useRequiredParams('okmsId');
  const { t } = useTranslation('secret-manager');
  const { trackClick } = useOkmsTracking();
  const href = useHref(
    SECRET_MANAGER_ROUTES_URLS.secretCreateVersionDrawer(
      okmsId,
      secret.path,
      secret.metadata.currentVersion,
    ),
  );

  const { data: okms, isPending } = useOkmsById(okmsId);

  if (isPending) return <Skeleton data-testid={CREATE_VERSION_TEST_IDS.skeleton} />;

  return (
    <MukLink
      data-testid={CREATE_VERSION_TEST_IDS.createVersionLink}
      href={href}
      disabled={!isOkmsActive(okms)}
      onClick={() => {
        trackClick({
          location: PageLocation.tile,
          buttonType: ButtonType.button,
          actionType: 'action',
          actions: ['create', 'version'],
        });
      }}
      urn={okms?.iam?.urn}
      iamActions={[kmsIamActions.secretVersionCreate]}
    >
      {t('add_new_version')}
    </MukLink>
  );
};
