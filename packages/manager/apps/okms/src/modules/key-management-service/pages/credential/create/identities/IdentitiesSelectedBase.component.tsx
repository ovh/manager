import {
  IdentityGroup,
  IdentityOauthClient,
  IdentityUser,
} from '@key-management-service/types/identity.type';
import { useTranslation } from 'react-i18next';

import { Text } from '@ovhcloud/ods-react';

import { Datagrid, DatagridColumn } from '@ovh-ux/manager-react-components';
import { Button } from '@ovh-ux/muk';

type IdentityType = IdentityUser | IdentityGroup | IdentityOauthClient;

type IdentitiesSelectedBaseProps<T extends IdentityType> = {
  title: string;
  identityURNs: string[];
  addCallback: () => void;
  addButtonLabel: string;
  deleteCallback: () => void;
  datagridColumns: DatagridColumn<T>[];
  items: T[];
};

function IdentitiesSelectedBase<T extends IdentityType>({
  title,
  identityURNs,
  addCallback,
  addButtonLabel,
  deleteCallback,
  datagridColumns,
  items = [],
}: IdentitiesSelectedBaseProps<T>) {
  const { t } = useTranslation('key-management-service/credential');
  return (
    <div className="grid gap-4">
      <Text preset="heading-4">{title}</Text>
      <div className="flex gap-3">
        <Button
          variant="outline"
          size="sm"
          color="primary"
          disabled={identityURNs.length > 25}
          onClick={addCallback}
        >
          {addButtonLabel}
        </Button>
        <Button size="sm" color="critical" disabled={items.length === 0} onClick={deleteCallback}>
          {t(
            'key_management_service_credential_create_identities_users_list_button_delete_all_label',
          )}
        </Button>
      </div>
      <Datagrid
        columns={datagridColumns}
        items={items}
        totalItems={items.length}
        contentAlignLeft
        noResultLabel={t(
          'key_management_service_credential_create_identities_list_button_no_result_label',
        )}
      />
    </div>
  );
}

export default IdentitiesSelectedBase;
