import React from 'react';
import { useTranslation } from 'react-i18next';
import { ODS_BUTTON_VARIANT, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import {
  ActionMenu,
  ActionMenuItem,
  DataGridTextCell,
} from '@ovh-ux/manager-react-components';
import { useNavigate, useParams } from 'react-router-dom';
import { Secret } from '@secret-manager/types/secret.type';
import {
  LocationPathParams,
  SECRET_MANAGER_ROUTES_URLS,
} from '@secret-manager/routes/routes.constants';
import { Link } from '@/common/components/Link/Link.component';
import { useFormatDate } from '@/common/hooks/useFormatDate';
import { kmsIamActions } from '@/utils/iam/iam.constants';
import { SECRET_LIST_CELL_TEST_IDS } from './ListingCells.constant';

export const DatagridCellPath = (secret: Secret) => {
  const { okmsId } = useParams<LocationPathParams>();
  const url = SECRET_MANAGER_ROUTES_URLS.secret(okmsId, secret.path);

  return (
    <Link
      href={url}
      label={secret.path}
      isRouterLink
      data-testid={SECRET_LIST_CELL_TEST_IDS.path(secret.path)}
    />
  );
};

export const DatagridCellVersion = (secret: Secret) => {
  return (
    <DataGridTextCell
      data-testid={SECRET_LIST_CELL_TEST_IDS.version(secret.path)}
    >
      {secret.version.id}
    </DataGridTextCell>
  );
};

export const DatagridCreationDate = (secret: Secret) => {
  const { formatDate } = useFormatDate();
  return (
    <DataGridTextCell
      data-testid={SECRET_LIST_CELL_TEST_IDS.createdAt(secret.path)}
    >
      {formatDate(secret.metadata.createdAt)}
    </DataGridTextCell>
  );
};

export const DatagridAction = (secret: Secret) => {
  const { okmsId } = useParams<LocationPathParams>();
  const { t } = useTranslation('secret-manager');
  const navigate = useNavigate();

  const items: ActionMenuItem[] = [
    {
      id: 1,
      label: t('reveal_secret'),
      onClick: () => {
        navigate(
          SECRET_MANAGER_ROUTES_URLS.secretListSecretValueDrawer(
            okmsId,
            secret.path,
          ),
        );
      },
      urn: secret.iam.urn,
      iamActions: [kmsIamActions.secretGet, kmsIamActions.secretVersionGetData],
    },
    {
      id: 2,
      label: t('add_new_version'),
      onClick: () => {
        navigate(
          SECRET_MANAGER_ROUTES_URLS.secretListCreateVersionDrawer(
            okmsId,
            secret.path,
          ),
        );
      },
      urn: secret.iam.urn,
      iamActions: [kmsIamActions.secretVersionCreate],
    },
    {
      id: 3,
      label: t('access_versions'),
      onClick: () => {
        navigate(SECRET_MANAGER_ROUTES_URLS.versionList(okmsId, secret.path));
      },
    },
    {
      id: 4,
      label: t('delete_secret'),
      onClick: () => {
        navigate(
          SECRET_MANAGER_ROUTES_URLS.secretListDeleteSecretModal(
            okmsId,
            secret.path,
          ),
        );
      },
      urn: secret.iam.urn,
      iamActions: [kmsIamActions.secretDelete],
    },
  ];

  return (
    <ActionMenu
      id={`SecretActionMenu-${secret.path}`}
      items={items}
      isCompact
      icon={ODS_ICON_NAME.ellipsisVertical}
      variant={ODS_BUTTON_VARIANT.ghost}
    />
  );
};
