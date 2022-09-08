import React from 'react';
import { withTheme } from '@rjsf/core';
import { RJSFSchema, UiSchema } from '@rjsf/utils';
import validator from '@rjsf/validator-ajv6';
import { Theme as ChakraUITheme } from '@rjsf/chakra-ui';

export type FormProps = {
  schema: RJSFSchema;
  uiSchema?: UiSchema;
  formData?: unknown;
  onFormSubmit?: (data: undefined, event: React.FormEvent<any>) => void;
};

export default function Form(props: FormProps): JSX.Element {
  const JSForm = withTheme(ChakraUITheme);
  const { schema, uiSchema, formData, onFormSubmit } = props;

  return (
    <JSForm
      schema={schema}
      uiSchema={uiSchema}
      formData={formData}
      validator={validator}
      noHtml5Validate={true}
      showErrorList={false}
      onSubmit={onFormSubmit}
    ></JSForm>
  );
}
