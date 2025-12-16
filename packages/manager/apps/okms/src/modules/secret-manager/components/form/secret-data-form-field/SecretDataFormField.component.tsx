import { useState } from 'react';

import { KeyValuesEditor } from '@secret-manager/components/form/key-values-editor/KeyValuesEditor';
import {
  SecretValueToggle,
  SecretValueToggleState,
} from '@secret-manager/components/secret-value/SecretValueToggle.component';
import { isKeyValueObjectString } from '@secret-manager/utils/key-value/keyValue';
import { FieldValues, UseControllerProps, useController } from 'react-hook-form';

import { SecretDataJsonFormField } from './SecretDataJsonFormField.component';

export const SecretDataFormField = <T extends FieldValues>({
  name,
  control,
}: UseControllerProps<T>) => {
  const { field } = useController({ name, control });

  const [toggleState, setToggleState] = useState<SecretValueToggleState>(
    isKeyValueObjectString(field.value) ? 'key-value' : 'json',
  );

  return (
    <div className="space-y-6">
      <SecretValueToggle state={toggleState} onChange={setToggleState} />
      {toggleState === 'key-value' ? (
        <KeyValuesEditor name={name} control={control} />
      ) : (
        <SecretDataJsonFormField name={name} control={control} />
      )}
    </div>
  );
};
