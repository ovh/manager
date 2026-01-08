import { useNavigate } from 'react-router-dom';

import { useOkmsById } from '@key-management-service/data/hooks/useOkms';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { Secret } from '@secret-manager/types/secret.type';
import { useTranslation } from 'react-i18next';

import { Icon } from '@ovhcloud/ods-react';

import { ButtonType, PageLocation } from '@ovh-ux/manager-react-shell-client';
import { Button } from '@ovh-ux/muk';

import { useOkmsTracking } from '@/common/hooks/useOkmsTracking';
import { kmsIamActions } from '@/common/utils/iam/iam.constants';
import { isOkmsActive } from '@/common/utils/okms/isOkmsActive';

export const ADD_VERSION_BUTTON_TEST_ID = 'add-version-button';

type AddVersionButtonProps = {
  okmsId: string;
  secret: Secret;
};

export const AddVersionButton = ({ okmsId, secret }: AddVersionButtonProps) => {
  const navigate = useNavigate();
  const { trackClick } = useOkmsTracking();
  const { t } = useTranslation(['secret-manager']);
  const { data: okms, isPending } = useOkmsById(okmsId);

  return (
    <Button
      data-testid={ADD_VERSION_BUTTON_TEST_ID}
      id={secret.path}
      onClick={() => {
        navigate(
          SECRET_MANAGER_ROUTES_URLS.versionListCreateVersionDrawer(
            okmsId,
            secret.path,
            secret.metadata.currentVersion,
          ),
        );
        trackClick({
          location: PageLocation.page,
          buttonType: ButtonType.button,
          actionType: 'navigation',
          actions: ['create', 'version'],
        });
      }}
      disabled={!isOkmsActive(okms)}
      loading={isPending}
      urn={okms?.iam?.urn}
      iamActions={[kmsIamActions.secretVersionCreate]}
    >
      <>
        <Icon name="plus" />
        {t('add_new_version')}
      </>
    </Button>
  );
};
