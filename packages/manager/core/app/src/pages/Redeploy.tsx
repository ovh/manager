import React from 'react';
import { RJSFSchema } from '@rjsf/utils';

import Form from '../components/Form';

export default function Redeploy(): JSX.Element {
  const schema: RJSFSchema = {
    title: 'Nutanix Redeploy',
    type: 'object',
    properties: {
      name: {
        type: 'string',
        title: 'Test',
      },
    },
  };

  const confirmRedeploy = ({ formData }: { formData: undefined }): void => {
    console.log(formData);
  };

  return <Form schema={schema} onFormSubmit={confirmRedeploy}></Form>;
}
