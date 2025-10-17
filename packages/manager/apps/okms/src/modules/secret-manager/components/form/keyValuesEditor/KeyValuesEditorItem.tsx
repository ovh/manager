import React from 'react';
import {
  OdsFormField,
  OdsInput,
  OdsButton,
} from '@ovhcloud/ods-components/react';
import {
  OdsInputChangeEventDetail,
  OdsInputCustomEvent,
} from '@ovhcloud/ods-components';

export type KeyValuePair = {
  key: string;
  value: string;
};

type KeyValuesEditorItemProps = {
  index: number;
  item: KeyValuePair;
  onChange: (item: KeyValuePair) => void;
  onDelete: () => void;
  onBlur: () => void;
};

type OdsInputChangeEventHandler = (
  event: OdsInputCustomEvent<OdsInputChangeEventDetail>,
) => void;

export const KeyValuesEditorItem = ({
  index,
  item,
  onChange,
  onDelete,
  onBlur,
}: KeyValuesEditorItemProps) => {
  const keyInputName = `key-value-pair-key-input-index-${index}`;
  const valueInputName = `key-value-pair-value-input-index-${index}`;

  const handleKeyChange: OdsInputChangeEventHandler = (event) => {
    onChange({ ...item, key: event.detail.value.toString() });
  };

  const handleValueChange: OdsInputChangeEventHandler = (event) => {
    onChange({ ...item, value: event.detail.value.toString() });
  };

  return (
    <div className="flex gap-2 items-center">
      <OdsFormField className="w-full">
        <label slot="label">Clé</label>
        <OdsInput
          name={keyInputName}
          value={item.key}
          onOdsChange={handleKeyChange}
          onOdsBlur={onBlur}
        />
      </OdsFormField>
      <OdsFormField className="w-full">
        <label slot="label">Valeur</label>

        <OdsInput
          name={valueInputName}
          value={item.value}
          onOdsChange={handleValueChange}
          onOdsBlur={onBlur}
        />
      </OdsFormField>
      <OdsButton
        className="mt-5"
        size="sm"
        variant="ghost"
        icon="trash"
        label=""
        onClick={onDelete}
      />
    </div>
  );
};
