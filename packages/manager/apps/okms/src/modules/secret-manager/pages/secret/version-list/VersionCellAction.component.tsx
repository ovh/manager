import { Secret, SecretVersion } from '@secret-manager/types/secret.type';

import { ODS_BUTTON_VARIANT, ODS_ICON_NAME } from '@ovhcloud/ods-components';

import { ActionMenu, ActionMenuItem } from '@ovh-ux/manager-react-components';

import { useActivateVersionItem } from './actions/activate-version/useActivateVersionMenuItem';
import { useDeactivateVersionItem } from './actions/deactivate-version/useDeactivateVersionMenuItem';
import { useDeleteVersionItem } from './actions/delete-version/useDeleteVersionMenuItem';
import { useRevealValueMenuItem } from './actions/reveal-value/useRevealValueMenuItem';

export const VersionCellAction = ({
  okmsId,
  secret,
  version,
}: {
  okmsId: string;
  secret: Secret;
  version: SecretVersion;
}) => {
  const revealValueItem = useRevealValueMenuItem({ id: 1, okmsId, secret, version });
  const activateVersionItem = useActivateVersionItem({ id: 2, okmsId, secret, version });
  const deactivateVersionItem = useDeactivateVersionItem({
    id: 3,
    okmsId,
    secret,
    version,
  });
  const deleteVersionItem = useDeleteVersionItem({ id: 4, okmsId, secret, version });

  const items: ActionMenuItem[] = [
    ...(revealValueItem ? [revealValueItem] : []),
    ...(deactivateVersionItem ? [deactivateVersionItem] : []),
    ...(activateVersionItem ? [activateVersionItem] : []),
    ...(deleteVersionItem ? [deleteVersionItem] : []),
  ];

  return (
    <ActionMenu
      id={`VersionActionMenu-${version.id}`}
      items={items}
      isCompact
      icon={ODS_ICON_NAME.ellipsisVertical}
      variant={ODS_BUTTON_VARIANT.ghost}
      isDisabled={items.length === 0}
    />
  );
};
