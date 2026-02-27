import { Secret, SecretVersion } from '@secret-manager/types/secret.type';

import { ActionMenu, ActionMenuItemProps, BUTTON_VARIANT } from '@ovh-ux/muk';

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

  const items: ActionMenuItemProps[] = [
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
      variant={BUTTON_VARIANT.ghost}
      isDisabled={items.length === 0}
    />
  );
};
