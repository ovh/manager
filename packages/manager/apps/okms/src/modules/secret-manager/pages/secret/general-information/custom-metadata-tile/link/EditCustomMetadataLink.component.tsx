import { useOkmsById } from '@key-management-service/data/hooks/useOkms';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { Secret } from '@secret-manager/types/secret.type';
import { useTranslation } from 'react-i18next';

import { Skeleton } from '@ovhcloud/ods-react';

import { ButtonType, PageLocation } from '@ovh-ux/manager-react-shell-client';

import { InternalLink } from '@/common/components/link/Link.component';
import { useOkmsTracking } from '@/common/hooks/useOkmsTracking';
import { useRequiredParams } from '@/common/hooks/useRequiredParams';
import { kmsIamActions } from '@/common/utils/iam/iam.constants';
import { isOkmsActive } from '@/common/utils/okms/isOkmsActive';

import { EDIT_CUSTOM_METADATA_LINK_TEST_IDS } from '../CustomMetadataTile.constants';

type EditCustomMetadataLinkProps = {
  secret: Secret;
};

export const EditCustomMetadataLink = ({ secret }: EditCustomMetadataLinkProps) => {
  const { t } = useTranslation('secret-manager');
  const { okmsId } = useRequiredParams('okmsId');
  const { trackClick } = useOkmsTracking();

  const href = SECRET_MANAGER_ROUTES_URLS.secretEditCustomMetadataDrawer(okmsId, secret.path);
  const { data: okms, isPending } = useOkmsById(okmsId);

  if (isPending) {
    return <Skeleton data-testid={EDIT_CUSTOM_METADATA_LINK_TEST_IDS.skeleton} />;
  }

  const customMetadata = secret.metadata.customMetadata;

  return (
    <InternalLink
      data-testid={EDIT_CUSTOM_METADATA_LINK_TEST_IDS.editCustomMetadataLink}
      to={href}
      disabled={!isOkmsActive(okms)}
      onClick={() => {
        trackClick({
          location: PageLocation.tile,
          buttonType: ButtonType.button,
          actionType: 'action',
          actions: ['edit', 'custom', 'metadata'],
        });
      }}
      urn={okms?.iam?.urn}
      iamActions={[kmsIamActions.secretEdit, kmsIamActions.secretMetadataUpdate]}
    >
      {customMetadata ? t('edit_custom_metadata') : t('add_custom_metadata')}
    </InternalLink>
  );
};
