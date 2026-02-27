import { IdentityOauthClient } from '@key-management-service/types/identity.type';
import { useTranslation } from 'react-i18next';

import { IdentitiesBaseTile } from './IdentitiesBaseTile.component';
import { IDENTITIES_BASE_TILE_TEST_IDS } from './IdentitiesBaseTile.constants';
import { IdentityRow } from './IdentityRow.component';

type IdentitiesServiceAccountTileProps = {
  item: IdentityOauthClient;
  isSelected: boolean;
  onToggle: () => void;
};

export const IdentitiesServiceAccountTile = ({
  item,
  isSelected,
  onToggle,
}: IdentitiesServiceAccountTileProps) => {
  const { t } = useTranslation('key-management-service/credential');

  return (
    <IdentitiesBaseTile
      title={item.name}
      onToggle={onToggle}
      isSelected={isSelected}
      testId={IDENTITIES_BASE_TILE_TEST_IDS.serviceAccount(item.identity)}
    >
      <div className="mb-2 space-y-1">
        <IdentityRow
          label={t(
            'key_management_service_credential_create_identities_service-account_tile_description_label',
          )}
          value={item.description}
        />
        <IdentityRow
          label={t(
            'key_management_service_credential_create_identities_service-account_tile_identity_label',
          )}
          value={item.identity || ''}
        />
      </div>
    </IdentitiesBaseTile>
  );
};
