import React, { useState } from 'react';
import { useController, UseControllerProps } from 'react-hook-form';
import { isSimpleKeyValueObjectFromString } from '@secret-manager/utils/keyValue';
import {
  SecretValueToggle,
  SecretValueToggleState,
} from '@secret-manager/components/SecretValueToggle';
import { KeyValuesEditor } from '../keyValuesEditor/KeyValuesEditor';
import { SecretDataInput } from './SecretDataInput.component';

type FormFieldInput = {
  data: string;
};

export const SecretDataFormField = <T extends FormFieldInput>({
  name,
  control,
}: UseControllerProps<T>) => {
  const { field } = useController({ name, control });

  const isKeyValueObject = isSimpleKeyValueObjectFromString(field.value);
  const isEmpty = !field.value;
  const [toggleState, setToggleState] = useState<SecretValueToggleState>(
    isKeyValueObject || isEmpty ? 'key-value' : 'json',
  );

  return (
    <div className="flex flex-col gap-6 pl-1 mt-1">
      <div>
        <SecretValueToggle state={toggleState} onChange={setToggleState} />
      </div>
      {toggleState === 'key-value' ? (
        <KeyValuesEditor name={name} control={control} />
      ) : (
        <SecretDataInput name={name} control={control} />
      )}
    </div>
  );
};
