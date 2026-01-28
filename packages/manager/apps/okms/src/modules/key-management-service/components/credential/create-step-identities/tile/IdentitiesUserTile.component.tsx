import { IdentityUser } from '@key-management-service/types/identity.type';
import { useTranslation } from 'react-i18next';

import { IdentitiesStatusBadge } from '../badge/IdentitiesStatusBadge.component';
import { IdentitiesBaseTile } from './IdentitiesBaseTile.component';
import { IdentityRow } from './IdentityRow.component';

type IdentitiesUserTileProps = {
  item: IdentityUser;
  isSelected: boolean;
  onToggle: () => void;
};

export const IdentitiesUserTile = ({ item, isSelected, onToggle }: IdentitiesUserTileProps) => {
  const { t } = useTranslation('key-management-service/credential');

  return (
    <IdentitiesBaseTile title={item.login} onToggle={onToggle} isSelected={isSelected}>
      <div className="mb-2 space-y-1">
        <IdentityRow
          label={t('key_management_service_credential_create_identities_user_tile_email_label')}
          value={item.email}
        />
        <IdentityRow
          label={t('key_management_service_credential_create_identities_user_tile_group_label')}
          value={item.group}
        />
        <IdentityRow
          label={t('key_management_service_credential_create_identities_user_tile_identity_label')}
          value={item.urn}
        />
      </div>
      <IdentitiesStatusBadge status={item.status} />
    </IdentitiesBaseTile>
  );
};
