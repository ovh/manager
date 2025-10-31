import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useController,
  UseControllerProps,
  useFormContext,
} from 'react-hook-form';
import { OdsButton, OdsFormField } from '@ovhcloud/ods-components/react';
import {
  formatKeyValueArrayFromString,
  formatStringFromKeyValueArray,
  isStringValidForKeyValueForm,
} from './utils/keyValue';
import { KeyValuesEditorItem, KeyValuePair } from './KeyValuesEditorItem';
import { KeyValuesEditorErrorMessage } from './KeyValuesEditorErrorMessage';
import { KEY_VALUES_EDITOR_TEST_IDS } from './keyValuesEditor.constants';

export type FormFieldInput = {
  data: string;
};

export const KeyValuesEditor = <T extends FormFieldInput>({
  name,
  control,
}: UseControllerProps<T>) => {
  const { t } = useTranslation(['secret-manager']);
  const { field, fieldState } = useController({ name, control });
  const { setError, clearErrors } = useFormContext(); // Requires a form provider to be present

  // We store the data in a local array to allow 2 rows with the same key
  // Otherwise, a row would disappear while typing as soon as a key appears twice
  const [keyValuePairs, setKeyValuePairs] = useState<KeyValuePair[]>(
    formatKeyValueArrayFromString(field.value),
  );

  const updateFormState = (newKeyValuePairs: KeyValuePair[]) => {
    // Update local state
    setKeyValuePairs(newKeyValuePairs);

    // Show an error message for duplicate keys
    const keys = new Set(newKeyValuePairs.map(({ key }) => key));
    const hasDuplicateKeys = keys.size !== newKeyValuePairs.length;
    if (hasDuplicateKeys) {
      setError(name, { message: t('error_duplicate_keys') });
      return;
    }

    // Clear any existing errors
    clearErrors(name);

    // Update global form state
    const data = formatStringFromKeyValueArray(newKeyValuePairs);
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

  if (!isStringValidForKeyValueForm(field.value)) {
    return <KeyValuesEditorErrorMessage />;
  }

  return (
    <div className="space-y-5">
      <OdsFormField
        className="w-full block space-y-1"
        error={fieldState.error?.message}
      >
        {keyValuePairs.map(({ key, value }, index) => (
          <KeyValuesEditorItem
            key={KEY_VALUES_EDITOR_TEST_IDS.pairItem(index)}
            index={index}
            item={{ key, value }}
            onChange={(item) => handleItemChange(index, item)}
            onDelete={() => handleDeleteItem(index)}
            onBlur={handleItemBlur}
            isDeletable={keyValuePairs.length > 1}
          />
        ))}
      </OdsFormField>
      <OdsButton
        size="sm"
        variant="outline"
        icon="plus"
        label={t('add_row')}
        onClick={handleAddItem}
      />
    </div>
  );
};
