import React from 'react';
import { FormProps as JSFormProps, IChangeEvent, withTheme } from '@rjsf/core';
import validator from '@rjsf/validator-ajv6';
import { Theme as ChakraUITheme } from '@rjsf/chakra-ui';

import { TitleFieldTemplate } from './templates';
import { RadioThumbnails, SwitchWidget } from './widgets';
import { FormLoading } from './FormLoading';

export type FormProps = Omit<JSFormProps, 'validator'> & {
  isLoading?: boolean;
};

export default function Form(props: FormProps): JSX.Element {
  if (props.isLoading) {
    return <FormLoading />;
  }

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

  const { schema, uiSchema, formData, onSubmit } = props;

  const onFormSubmit = (data: IChangeEvent, e: React.FormEvent) => {
    if (!data.errors.length) {
      onSubmit(data, e);
    }
  };

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
