import { IdentityGroup } from '@key-management-service/types/identity.type';
import { useTranslation } from 'react-i18next';

import { IdentitiesBaseTile } from './IdentitiesBaseTile.component';
import { IdentityRow } from './IdentityRow.component';

type IdentitiesGroupTileProps = {
  item: IdentityGroup;
  isSelected: boolean;
  onToggle: () => void;
};

export const IdentitiesGroupTile = ({ item, isSelected, onToggle }: IdentitiesGroupTileProps) => {
  const { t } = useTranslation('key-management-service/credential');

  return (
    <IdentitiesBaseTile title={item.name} onToggle={onToggle} isSelected={isSelected}>
      <div className="mb-2 space-y-1">
        <IdentityRow
          label={t(
            'key_management_service_credential_create_identities_group_tile_description_label',
          )}
          value={item.description || ''}
        />
        <IdentityRow
          label={t('key_management_service_credential_create_identities_group_tile_identity_label')}
          value={item.urn || ''}
        />
      </div>
    </IdentitiesBaseTile>
  );
};
