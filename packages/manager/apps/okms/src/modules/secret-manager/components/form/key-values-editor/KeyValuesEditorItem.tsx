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
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { KEY_VALUES_EDITOR_TEST_IDS } from './keyValuesEditor.constants';

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
  isDeletable: boolean;
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
  isDeletable,
}: KeyValuesEditorItemProps) => {
  const { t } = useTranslation(['secret-manager']);
  const keyInputName = KEY_VALUES_EDITOR_TEST_IDS.pairItemKeyInput(index);
  const valueInputName = KEY_VALUES_EDITOR_TEST_IDS.pairItemValueInput(index);

  const handleKeyChange: OdsInputChangeEventHandler = (event) => {
    const newKey = event.target.value.toString();
    onChange({ key: newKey, value: item.value });
  };

  const handleValueChange: OdsInputChangeEventHandler = (event) => {
    const newValue = event.target.value.toString();
    onChange({ key: item.key, value: newValue });
  };

  return (
    <div className="flex gap-2 items-center">
      <OdsFormField className="w-full">
        <label slot="label">{t('key')}</label>
        <OdsInput
          name={keyInputName}
          data-testid={keyInputName}
          value={item.key}
          onOdsChange={handleKeyChange}
          onOdsBlur={onBlur}
        />
      </OdsFormField>
      <OdsFormField className="w-full">
        <label slot="label">{t('value')}</label>

        <OdsInput
          name={valueInputName}
          data-testid={valueInputName}
          value={item.value}
          onOdsChange={handleValueChange}
          onOdsBlur={onBlur}
        />
      </OdsFormField>

      <OdsButton
        data-testid={KEY_VALUES_EDITOR_TEST_IDS.pairItemDeleteButton(index)}
        className={clsx('mt-5', {
          'opacity-0 group-hover:opacity-100 transition-opacity duration-100': !isDeletable,
          'opacity-100': isDeletable,
        })}
        size="sm"
        variant="ghost"
        icon="trash"
        label=""
        onClick={onDelete}
        isDisabled={!isDeletable}
      />
    </div>
  );
};
