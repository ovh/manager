import React, { useState } from 'react';
import { useController, UseControllerProps } from 'react-hook-form';
import { isStringValidForKeyValueForm } from '@secret-manager/components/form/key-values-editor/utils/keyValue';
import {
  SecretValueToggle,
  SecretValueToggleState,
} from '@secret-manager/components/secret-value-toggle/SecretValueToggle.component';
import { KeyValuesEditor } from '@secret-manager/components/form/key-values-editor/KeyValuesEditor';
import { SecretDataJsonFormField } from './SecretDataJsonFormField.component';

type FormFieldInput = {
  data: string;
};

export const SecretDataFormField = <T extends FormFieldInput>({
  name,
  control,
}: UseControllerProps<T>) => {
  const { field } = useController({ name, control });

  const [toggleState, setToggleState] = useState<SecretValueToggleState>(
    isStringValidForKeyValueForm(field.value) ? 'key-value' : 'json',
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <SecretValueToggle state={toggleState} onChange={setToggleState} />
      </div>
      {toggleState === 'key-value' ? (
        <KeyValuesEditor name={name} control={control} />
      ) : (
        <SecretDataJsonFormField name={name} control={control} />
      )}
    </div>
  );
};
