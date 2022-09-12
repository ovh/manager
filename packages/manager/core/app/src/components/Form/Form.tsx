import React from 'react';
import { withTheme } from '@rjsf/core';
import { RJSFSchema, UiSchema } from '@rjsf/utils';
import validator from '@rjsf/validator-ajv6';
import { Theme as ChakraUITheme } from '@rjsf/chakra-ui';

import { TitleFieldTemplate } from './templates';
import { RadioThumbnails, SwitchWidget } from './widgets';

export type FormProps = {
  schema: RJSFSchema;
  uiSchema?: UiSchema;
  formData?: unknown;
  onFormSubmit?: (data: undefined, event: React.FormEvent<unknown>) => void;
};

export default function Form(props: FormProps): JSX.Element {
  // customize a little bit the chakra ui form implementation
  ChakraUITheme.templates = {
    ...ChakraUITheme.templates,
    TitleFieldTemplate,
  };

  // add some widgets to the chakra ui form implementation
  ChakraUITheme.widgets = {
    ...ChakraUITheme.widgets,
    switch: SwitchWidget,
    radioThumbnails: RadioThumbnails,
  };

  // create a JSON Schema Form component with chakra ui theme applied
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
