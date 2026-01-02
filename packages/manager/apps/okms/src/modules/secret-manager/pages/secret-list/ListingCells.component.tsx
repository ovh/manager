import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { Secret } from '@secret-manager/types/secret.type';

import { ODS_BUTTON_VARIANT, ODS_ICON_NAME } from '@ovhcloud/ods-components';

import { ActionMenu, ActionMenuItem, DataGridTextCell } from '@ovh-ux/manager-react-components';
import { ButtonType, PageLocation } from '@ovh-ux/manager-react-shell-client';

import { Link } from '@/common/components/link/Link.component';
import { useFormatDate } from '@/common/hooks/useFormatDate';
import { useOkmsTracking } from '@/common/hooks/useOkmsTracking';
import { useRequiredParams } from '@/common/hooks/useRequiredParams';

import { SECRET_LIST_CELL_TEST_IDS } from './ListingCells.constant';
import { useAccessVersionMenuItem } from './actions/access-versions/useAccessVersionsMenuItem';
import { useAddVersionMenuItem } from './actions/addVersion/useAddVersionMenuItem';
import { useDeleteSecretMenuItem } from './actions/delete-secret/useDeleteSecretMenuItem';
import { useRevealSecretMenuItem } from './actions/reveal-secret/useRevealSecretMenuItem';

export const DatagridCellPath = (secret: Secret) => {
  const { okmsId } = useRequiredParams('okmsId');
  const { trackClick } = useOkmsTracking();
  const url = SECRET_MANAGER_ROUTES_URLS.secret(okmsId, secret.path);

  return (
    <Link
      href={url}
      label={secret.path}
      isRouterLink
      data-testid={SECRET_LIST_CELL_TEST_IDS.path(secret.path)}
      onClick={() => {
        trackClick({
          location: PageLocation.datagrid,
          buttonType: ButtonType.link,
          actionType: 'navigation',
          actions: ['secret'],
        });
      }}
    />
  );
};

export const DatagridCellVersion = (secret: Secret) => {
  return (
    <DataGridTextCell data-testid={SECRET_LIST_CELL_TEST_IDS.version(secret.path)}>
      {secret.version?.id ?? '-'}
    </DataGridTextCell>
  );
};

export const DatagridCreationDate = (secret: Secret) => {
  const { formatDate } = useFormatDate();
  return (
    <DataGridTextCell data-testid={SECRET_LIST_CELL_TEST_IDS.createdAt(secret.path)}>
      {formatDate(secret.metadata.createdAt)}
    </DataGridTextCell>
  );
};

export const DatagridAction = (secret: Secret) => {
  const { okmsId } = useRequiredParams('okmsId');

  const revealValueItem = useRevealSecretMenuItem({ id: 1, okmsId, secret });
  const addVersionItem = useAddVersionMenuItem({ id: 2, okmsId, secret });
  const accessVersionsItem = useAccessVersionMenuItem({ id: 3, okmsId, secret });
  const deleteSecretItem = useDeleteSecretMenuItem({ id: 4, okmsId, secret });

  const items: ActionMenuItem[] = [
    revealValueItem,
    addVersionItem,
    accessVersionsItem,
    deleteSecretItem,
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
