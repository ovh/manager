import React from 'react';
import { RJSFSchema } from '@rjsf/utils';
import { Box } from '@chakra-ui/react';

import Form from '../components/Form';

export default function Redeploy(): JSX.Element {
  const schema: RJSFSchema = {
    title: 'Nutanix Redeploy',
    type: 'object',
    properties: {
      redundancyFactor: {
        type: 'object',
        title: 'Facteur de réplication',
        description: `Vous pouvez opter pour des données (VM et Oplog) répliquées deux ou trois fois au sein de votre cluster. Une plus grande réplication permet une meilleure tolérance aux incidents, mais consommera davantage d’espace de stockage.`,
        required: ['value'],
        properties: {
          value: {
            type: 'number',
            title: '',
            enum: [2, 3],
            enumNames: [
              'Facteur de réplication: 2 (RF2)',
              'Facteur de réplication: 3 (RF3)',
            ],
          },
        },
      },
      erasureCoding: {
        type: 'object',
        title: 'Fonction Erasure Coding',
        description: `Vous pouvez activer la fonction « Erasure Coding ». Celle-ci augmentera la capacité de stockage effective, mais n’est pas recommandée en dessous de 4 nœuds.`,
        properties: {
          value: {
            type: 'boolean',
            title: null,
          },
        },
      },
    },
  };

  const uiSchema = {
    'ui:titleOptions': {
      as: 'h4',
      size: 'md',
    },
    redundancyFactor: {
      value: {
        'ui:widget': 'radioThumbnails',
      },
    },
    erasureCoding: {
      value: {
        'ui:widget': 'switch',
      },
    },
  };

  const confirmRedeploy = ({ formData }: { formData: undefined }): void => {
    console.log(formData);
  };

  return (
    <Box w="75%">
      <Form
        schema={schema}
        uiSchema={uiSchema}
        onFormSubmit={confirmRedeploy}
      ></Form>
    </Box>
  );
}
