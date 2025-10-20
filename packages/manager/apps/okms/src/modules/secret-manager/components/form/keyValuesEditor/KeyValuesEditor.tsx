import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useController,
  UseControllerProps,
  useFormContext,
} from 'react-hook-form';
import {
  formatKeyValuePairsFromString,
  formatStringFromKeyValuePairs,
  isSimpleKeyValueObjectFromString,
} from '@secret-manager/utils/keyValue';
import { OdsButton, OdsFormField } from '@ovhcloud/ods-components/react';
import { KeyValuesEditorItem, KeyValuePair } from './KeyValuesEditorItem';
import { KeyValuesEditorErrorMessage } from './KeyValuesEditorErrorMessage';

type FormFieldInput = {
  data: string;
};

export const KeyValuesEditor = <T extends FormFieldInput>({
  name,
  control,
}: UseControllerProps<T>) => {
  const { t } = useTranslation(['secret-manager']);
  const { field, fieldState } = useController({ name, control });
  const { setError } = useFormContext();

  // We store the data in a local array to allow 2 rows with the same key
  // Otherwise, an row would disappear while typing as soon as a key appears twice
  const [keyValuePairs, setKeyValuePairs] = useState<KeyValuePair[]>(
    formatKeyValuePairsFromString(field.value),
  );

  const updateFormState = (newKeyValuePairs: KeyValuePair[]) => {
    // Update local state
    setKeyValuePairs(newKeyValuePairs);

    // Look for duplicate keys
    const keys = new Set(newKeyValuePairs.map(({ key }) => key));
    const hasDuplicateKeys = keys.size !== newKeyValuePairs.length;
    if (hasDuplicateKeys) {
      setError(name, { message: t('error_duplicate_keys') });
      return;
    }

    // Update form state
    const data = formatStringFromKeyValuePairs(newKeyValuePairs);
    field.onChange(data);
  };

  const handleItemChange = (index: number, item: KeyValuePair) => {
    const newKeyValuePairs = [...keyValuePairs];
    newKeyValuePairs[index] = item;
    updateFormState(newKeyValuePairs);
  };

  const handleAddItem = () => {
    const newKeyValuePairs = [...keyValuePairs];
    newKeyValuePairs.push({ key: '', value: '' });
    updateFormState(newKeyValuePairs);
  };

  const handleDeleteItem = (index: number) => {
    const newKeyValuePairs = [...keyValuePairs];
    newKeyValuePairs.splice(index, 1);
    updateFormState(newKeyValuePairs);
  };

  const handleItemBlur = () => {
    updateFormState(keyValuePairs);
  };

  const isKeyValueObject = isSimpleKeyValueObjectFromString(field.value);
  const isValueEmpty = !field.value;
  if (isKeyValueObject || isValueEmpty) {
    return (
      <div className="space-y-5">
        <OdsFormField
          className="w-full block space-y-1"
          error={fieldState.error?.message}
        >
          {keyValuePairs.map(({ key, value }, index) => (
            <KeyValuesEditorItem
              key={`key-value-pair-item-index-${index}`}
              index={index}
              item={{ key, value }}
              onChange={(item) => handleItemChange(index, item)}
              onDelete={() => handleDeleteItem(index)}
              onBlur={handleItemBlur}
            />
          ))}
        </OdsFormField>
        <OdsButton
          size="sm"
          variant="outline"
          icon="plus"
          label="Ajouter une ligne"
          onClick={handleAddItem}
        />
      </div>
    );
  }

  return <KeyValuesEditorErrorMessage />;
};
