import React from 'react';
import { Datagrid, DatagridColumn } from '@ovh-ux/manager-react-components';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_BUTTON_COLOR,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { OdsButton, OdsText } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';

type IdentitiesSelectedBaseProps = {
  title: string;
  identityURNs: string[];
  addCallback: () => void;
  addButtonLabel: string;
  deleteCallback: () => void;
  datagridColumns: DatagridColumn<unknown>[];
  items: any[];
};

const IdentitiesSelectedBase = ({
  title,
  identityURNs,
  addCallback,
  addButtonLabel,
  deleteCallback,
  datagridColumns,
  items = [],
}: IdentitiesSelectedBaseProps) => {
  const { t } = useTranslation('key-management-service/credential');
  return (
    <div className="grid gap-4">
      <OdsText preset={ODS_TEXT_PRESET.heading4}>{title}</OdsText>
      <div className="flex gap-3">
        <OdsButton
          variant={ODS_BUTTON_VARIANT.outline}
          size={ODS_BUTTON_SIZE.sm}
          color={ODS_BUTTON_COLOR.primary}
          isDisabled={identityURNs.length > 25}
          onClick={addCallback}
          label={addButtonLabel}
        />
        <OdsButton
          size={ODS_BUTTON_SIZE.sm}
          color={ODS_BUTTON_COLOR.critical}
          isDisabled={items.length === 0}
          onClick={deleteCallback}
          label={t(
            'key_management_service_credential_create_identities_users_list_button_delete_all_label',
          )}
        />
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
};

export default IdentitiesSelectedBase;
