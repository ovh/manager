import React from 'react';
import {
  ActionMenu,
  ActionMenuItem,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import {
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_BUTTON_COLOR,
} from '@ovhcloud/ods-components';
import {
  SecretVersion,
  SecretVersionState,
} from '@secret-manager/types/secret.type';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUpdateSecretVersion } from '@secret-manager/data/hooks/useUpdateSecretVersion';
import { ApiError } from '@ovh-ux/manager-core-api';
import { kmsIamActions } from '@/utils/iam/iam.constants';

type ButtonState = 'hidden' | 'enabled' | 'disabled';
type ButtonAction = 'show_value' | 'activate' | 'deactivate' | 'delete';

type ButtonGroupState = Record<ButtonAction, ButtonState>;

// Defines all button states for each version state
const buttonsStateRecord: Record<SecretVersionState, ButtonGroupState> = {
  ACTIVE: {
    show_value: 'enabled',
    activate: 'hidden',
    deactivate: 'enabled',
    delete: 'disabled',
  },
  DEACTIVATED: {
    show_value: 'disabled',
    activate: 'enabled',
    deactivate: 'hidden',
    delete: 'enabled',
  },
  DELETED: {
    show_value: 'disabled',
    activate: 'disabled',
    deactivate: 'hidden',
    delete: 'disabled',
  },
};

type VersionMenuItem = ActionMenuItem & { name: ButtonAction };

export const VersionCellAction = ({
  okmsId,
  secretPath,
  version,
  urn,
}: {
  okmsId: string;
  secretPath: string;
  version: SecretVersion;
  urn: string;
}) => {
  const { t } = useTranslation('secret-manager');
  const navigate = useNavigate();
  const { addError } = useNotifications();

  const {
    mutateAsync: updateSecretVersion,
    isPending,
  } = useUpdateSecretVersion();

  const buttonGroupState = buttonsStateRecord[version.state];

  const handleUpdateVersion = async (state: SecretVersionState) => {
    try {
      await updateSecretVersion({
        okmsId,
        path: secretPath,
        version: version.id,
        state,
      });
    } catch (error) {
      const apiError = error as ApiError;
      addError(apiError?.response?.data?.message);
    }
  };

  const handleDeleteVersion = () => {
    navigate(
      SECRET_MANAGER_ROUTES_URLS.versionListDeleteVersionModal(
        okmsId,
        secretPath,
        version.id,
      ),
    );
  };

  const handleRevealVersionValue = () => {
    navigate({
      pathname: SECRET_MANAGER_ROUTES_URLS.versionListSecretValueDrawer(
        okmsId,
        secretPath,
        version.id,
      ),
    });
  };

  const items: VersionMenuItem[] = [
    {
      id: 1,
      name: 'show_value' as const,
      label: t('reveal_secret'),
      isDisabled: buttonGroupState.show_value === 'disabled',
      onClick: handleRevealVersionValue,
      urn,
      iamActions: [kmsIamActions.secretGet, kmsIamActions.secretVersionGetData],
    },
    {
      id: 2,
      name: 'deactivate' as const,
      label: t('version_state_deactivate'),
      isDisabled: buttonGroupState.deactivate === 'disabled',
      isLoading: isPending,
      onClick: () => handleUpdateVersion('DEACTIVATED'),
      urn,
      iamActions: [
        kmsIamActions.secretVersionUpdate,
        kmsIamActions.secretVersionDeactivate,
      ],
    },
    {
      id: 3,
      name: 'activate' as const,
      label: t('version_state_reactivate'),
      isLoading: isPending,
      isDisabled: buttonGroupState.activate === 'disabled',
      onClick: () => handleUpdateVersion('ACTIVE'),
      urn,
      iamActions: [
        kmsIamActions.secretVersionUpdate,
        kmsIamActions.secretVersionActivate,
      ],
    },
    {
      id: 4,
      name: 'delete' as const,
      label: t('version_state_delete'),
      isDisabled: buttonGroupState.delete === 'disabled',
      color: ODS_BUTTON_COLOR.critical,
      onClick: handleDeleteVersion,
      urn,
      iamActions: [
        kmsIamActions.secretVersionUpdate,
        kmsIamActions.secretVersionDelete,
      ],
    },
  ];

  return (
    <ActionMenu
      id={`VersionActionMenu-${version.id}`}
      items={items.filter((item) => buttonGroupState[item.name] !== 'hidden')}
      isCompact
      icon={ODS_ICON_NAME.ellipsisVertical}
      variant={ODS_BUTTON_VARIANT.ghost}
    />
  );
};
