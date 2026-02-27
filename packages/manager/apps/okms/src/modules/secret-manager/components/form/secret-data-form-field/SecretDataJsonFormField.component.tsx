import { useState } from 'react';

import { Editor } from '@monaco-editor/react';
import { FieldValues, UseControllerProps, useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { FormField, FormFieldError, FormFieldLabel, Skeleton } from '@ovhcloud/ods-react';

import { SECRET_FORM_FIELD_TEST_IDS } from '../form.constants';

const EDITOR_HEIGHT = '300px';

export const SecretDataJsonFormField = <T extends FieldValues>({
  name,
  control,
}: UseControllerProps<T>) => {
  const { t } = useTranslation(['secret-manager']);
  const { field, fieldState } = useController({ name, control });
  const hasError = !!fieldState.error;
  const [hasUserEdited, setHasUserEdited] = useState(false);

  const handleChange = (value: string | undefined) => {
    setHasUserEdited(true);
    field.onChange(value ?? '');
  };

  // Format the value if the user has not edited it, otherwise use the original value
  const displayValue = hasUserEdited ? (field.value ?? '') : formatJsonIfValid(field.value ?? '');

  return (
    <FormField className="w-full" invalid={hasError}>
      <FormFieldLabel>{t('editor')}</FormFieldLabel>
      <Editor
        height={EDITOR_HEIGHT}
        language="json"
        theme="vs"
        value={displayValue}
        onChange={handleChange}
        loading={<Skeleton className="h-[300px] w-full" />}
        options={{
          fixedOverflowWidgets: true, // prevents error tooltips from being clipped
          folding: false, // disables code folding
          lineNumbersMinChars: 1, // ensures line numbers are always visible
          minimap: { enabled: false }, // hide the code minimap on the right side of the editor
          scrollBeyondLastLine: false, // prevent the editor from scrolling beyond the last line
          tabSize: 2,
          wordWrap: 'on', // wrap text if it exceeds the width of the editor
        }}
        wrapperProps={{
          'data-testid': SECRET_FORM_FIELD_TEST_IDS.INPUT_DATA,
          className:
            'rounded-md border p-2 border-solid border-[--ods-color-form-element-border-default] overflow-hidden',
        }}
      />
      {fieldState.error && <FormFieldError>{fieldState.error.message}</FormFieldError>}
    </FormField>
  );
};

/*
 * Formats a JSON string with 2 spaces indentation.
 */
const formatJsonIfValid = (value: string): string => {
  const trimmed = value.trim();
  if (!trimmed) return value;
  try {
    const parsed = JSON.parse(value) as unknown;
    return JSON.stringify(parsed, null, 2);
  } catch {
    return value;
  }
};
