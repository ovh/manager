import React from 'react';
import {
  CommonTitle,
  Datagrid,
  DatagridColumn,
} from '@ovh-ux/manager-react-components';
import { ODS_BUTTON_SIZE, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { OsdsButton } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';

type IdentitiesSelectedBaseProps = {
  title: string;
  addCallback: () => void;
  addButtonLabel: string;
  deleteCallback: () => void;
  datagridColumns: DatagridColumn<unknown>[];
  items: any[];
};

const IdentitiesSelectedBase = ({
  title,
  addCallback,
  addButtonLabel,
  deleteCallback,
  datagridColumns,
  items,
}: IdentitiesSelectedBaseProps) => {
  const { t } = useTranslation('key-management-service/credential');
  return (
    <>
      <CommonTitle>{title}</CommonTitle>
      <div className="flex gap-3">
        <OsdsButton
          inline
          variant={ODS_BUTTON_VARIANT.stroked}
          size={ODS_BUTTON_SIZE.sm}
          color={ODS_THEME_COLOR_INTENT.primary}
          onClick={addCallback}
        >
          {addButtonLabel}
        </OsdsButton>
        <OsdsButton
          inline
          size={ODS_BUTTON_SIZE.sm}
          color={ODS_THEME_COLOR_INTENT.error}
          disabled={items.length === 0 || undefined}
          onClick={deleteCallback}
        >
          {t(
            'key_management_service_credential_create_identities_users_list_button_delete_all_label',
          )}
        </OsdsButton>
      </div>
      <Datagrid
        columns={datagridColumns}
        items={items || []}
        totalItems={items?.length}
        contentAlignLeft
        noResultLabel={t(
          'key_management_service_credential_create_identities_list_button_no_result_label',
        )}
      />
    </>
  );
};

export default IdentitiesSelectedBase;
