import { useState } from 'react';

import { KeyValuesErrorMessage } from '@secret-manager/components/messages/KeyValuesErrorMessage';
import {
  KeyValuePair,
  isKeyValueObjectString,
  keyValuePairsToString,
  stringToKeyValuePairs,
} from '@secret-manager/utils/key-value/keyValue';
import { FieldValues, UseControllerProps, useController, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Icon, Text } from '@ovhcloud/ods-react';

import { Button } from '@ovh-ux/muk';

import { KeyValuesEditorItem } from './KeyValuesEditorItem';
import { KEY_VALUES_EDITOR_TEST_IDS } from './keyValuesEditor.constants';

type KeyValuesEditorProps<T extends FieldValues> = UseControllerProps<T> & {
  allowDeleteLastItem?: boolean;
};

export const KeyValuesEditor = <T extends FieldValues>({
  name,
  control,
  allowDeleteLastItem = false,
}: KeyValuesEditorProps<T>) => {
  const { t } = useTranslation(['secret-manager']);
  const { field, fieldState } = useController({ name, control });
  const { setError, clearErrors } = useFormContext(); // Requires a form provider to be present

  // We store the data in a local array to allow 2 rows with the same key
  // Otherwise, a row would disappear while typing as soon as a key appears twice
  const [keyValuePairs, setKeyValuePairs] = useState<KeyValuePair[]>(
    stringToKeyValuePairs(field.value),
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
    const data = keyValuePairsToString(newKeyValuePairs);
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

  if (!isKeyValueObjectString(field.value)) {
    return <KeyValuesErrorMessage />;
  }

  return (
    <div className="space-y-5">
      <div className="block w-full space-y-1">
        {keyValuePairs.map(({ key, value }, index) => (
          <KeyValuesEditorItem
            key={KEY_VALUES_EDITOR_TEST_IDS.pairItem(index)}
            index={index}
            item={{ key, value }}
            onChange={(item) => handleItemChange(index, item)}
            onDelete={() => handleDeleteItem(index)}
            onBlur={handleItemBlur}
            isDeletable={allowDeleteLastItem ? true : keyValuePairs.length > 1}
          />
        ))}
        {fieldState.error?.message && (
          <CustomFieldError>{fieldState.error?.message}</CustomFieldError>
        )}
      </div>
      <Button size="sm" variant="outline" onClick={handleAddItem}>
        <>
          <Icon name="plus" />
          {t('add_row')}
        </>
      </Button>
    </div>
  );
};

// KeyValuesEditor is an assembly of input components.
// Instead of targeting each inner input, CustomFieldError is used as a general error
// and displayed at the bottom of the component.
const CustomFieldError = ({ children }: { children: React.ReactNode }) => {
  return (
    <Text
      aria-live="polite"
      className="font-semibold text-[var(--ods-theme-input-text-color-invalid)]"
    >
      {children}
    </Text>
  );
};
