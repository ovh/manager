import { useHref } from 'react-router-dom';

import { useOkmsById } from '@key-management-service/data/hooks/useOkms';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { Secret } from '@secret-manager/types/secret.type';
import { useTranslation } from 'react-i18next';

import { OdsSkeleton } from '@ovhcloud/ods-components/react';

import { ManagerLink } from '@ovh-ux/manager-react-components';
import { ButtonType, PageLocation } from '@ovh-ux/manager-react-shell-client';

import { useOkmsTracking } from '@/common/hooks/useOkmsTracking';
import { useRequiredParams } from '@/common/hooks/useRequiredParams';
import { kmsIamActions } from '@/common/utils/iam/iam.constants';
import { isOkmsActive } from '@/common/utils/okms/isOkmsActive';

export const EDIT_METADATA_LINK_TEST_IDS = {
  skeleton: 'skeleton',
  editMetadataLink: 'edit-metadata-link',
};

type EditMetadataButtonProps = {
  secret: Secret;
};
export const EditMetadataLink = ({ secret }: EditMetadataButtonProps) => {
  const { t } = useTranslation(['secret-manager']);
  const { okmsId } = useRequiredParams('okmsId');
  const { trackClick } = useOkmsTracking();

  const href = useHref(SECRET_MANAGER_ROUTES_URLS.secretEditMetadataDrawer(okmsId, secret.path));

  const { data: okms, isPending } = useOkmsById(okmsId);

  if (isPending) return <OdsSkeleton data-testid={EDIT_METADATA_LINK_TEST_IDS.skeleton} />;

  return (
    <ManagerLink
      data-testid={EDIT_METADATA_LINK_TEST_IDS.editMetadataLink}
      href={href}
      label={t('edit_metadata')}
      isDisabled={!isOkmsActive(okms)}
      onClick={() => {
        trackClick({
          location: PageLocation.tile,
          buttonType: ButtonType.button,
          actionType: 'action',
          actions: ['edit', 'metadata'],
        });
      }}
      urn={okms?.iam?.urn}
      iamActions={[kmsIamActions.secretEdit, kmsIamActions.secretMetadataUpdate]}
    />
  );
};
