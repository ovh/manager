import {
  OdsFormField,
  OdsInput,
  OdsButton,
} from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import clsx from 'clsx';

export type TTagRowProps = {
  id: number;
  keyValue: string;
  value: string;
  isEditing: boolean;
  editingKey: string;
  onKeyFocus: (id: number, currentKey: string) => void;
  onValueFocus: (id: number) => void;
  onTagChange: (id: number, field: 'key' | 'value', value: string) => void;
  onKeyBlur: (id: number) => void;
  onRemove: (id: number) => void;
  t: (key: string) => string;
  errors?: {
    key?: string;
    value?: string;
  };
};

export const TagRow = ({
  id,
  keyValue,
  value,
  isEditing,
  editingKey,
  onKeyFocus,
  onValueFocus,
  onTagChange,
  onKeyBlur,
  onRemove,
  t,
  errors,
}: TTagRowProps) => (
  <div className="flex flex-col md:flex-row md:items-end gap-4 mb-4 mt-4">
    <OdsFormField
      className="mt-2 w-full md:w-auto md:min-w-[300px] block"
      error={errors?.key}
    >
      <label slot="label">
        {t(
          'containers/replication/add:pci_projects_project_storages_containers_replication_add_tag_key',
        )}
      </label>
      <OdsInput
        className={clsx('w-full', errors?.value && !errors?.key && 'mb-[21px]')}
        value={isEditing ? editingKey : keyValue}
        name={`tag-key-${id}`}
        color="primary"
        hasError={!!errors?.key}
        onFocus={() => onKeyFocus(id, keyValue)}
        onOdsChange={(event) =>
          onTagChange(id, 'key', event.detail.value.toString())
        }
        onBlur={() => onKeyBlur(id)}
      />
    </OdsFormField>

    <OdsFormField
      className="mt-2 w-full md:w-auto md:min-w-[300px] block"
      error={errors?.value}
    >
      <label slot="label">
        {t(
          'containers/replication/add:pci_projects_project_storages_containers_replication_add_tag_value',
        )}
      </label>
      <OdsInput
        className={clsx('w-full', errors?.key && !errors?.value && 'mb-[21px]')}
        value={value}
        name={`tag-value-${id}`}
        color="primary"
        hasError={!!errors?.value}
        onFocus={() => onValueFocus(id)}
        onOdsChange={(event) =>
          onTagChange(id, 'value', event.detail.value.toString())
        }
      />
    </OdsFormField>

    <div className="w-full md:w-auto mb-2 md:mb-0 flex gap-2">
      <OdsButton
        className={clsx(
          'w-full md:w-auto',
          (errors?.value || errors?.key) && 'mb-[18px]',
        )}
        icon="trash"
        size="sm"
        label=""
        variant={ODS_BUTTON_VARIANT.outline}
        onClick={() => onRemove(id)}
      />
    </div>
  </div>
);
