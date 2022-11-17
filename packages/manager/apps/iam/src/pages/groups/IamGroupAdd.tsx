import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  Form,
  MessageBox,
  MessageBoxMessage,
} from '@ovh-ux/manager-react-core-components';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { createResourceGroup } from '@/api';
import useResourceGroupForm, {
  IamResourceGroupFormData,
} from '@/hooks/useResourceGroupForm';

export default function IamPolicies() {
  const { t } = useTranslation(['iam/groups/add', 'iam/groups']);
  const [createError, setCreateError] = useState<MessageBoxMessage>();
  const navigate = useNavigate();
  const { isFormLoading, schema, getGroupPayload } = useResourceGroupForm();

  const queryClient = useQueryClient();

  const createGroup = async ({
    formData: submittedData,
  }: {
    formData: IamResourceGroupFormData;
  }) => {
    const groupPayload = getGroupPayload(submittedData);

    try {
      // POST to the API
      await createResourceGroup(groupPayload);
      // invalidate query cache
      queryClient.removeQueries(['iam_resource_group']);
      // navigate to parent page
      navigate('..', {
        state: {
          actionResult: {
            type: 'success',
            message: (
              <Trans
                t={t}
                i18nKey="create_success"
                values={{ name: groupPayload.name }}
              ></Trans>
            ),
          } as MessageBoxMessage,
        },
      });
    } catch (error) {
      setCreateError({
        type: 'error',
        message: <Trans t={t} i18nKey="create_error"></Trans>,
        error,
      });
    }
  };

  return (
    <>
      {createError && <MessageBox {...createError} dismissable={true} />}
      <Form
        schema={schema}
        isLoading={isFormLoading}
        onSubmit={createGroup}
      ></Form>
    </>
  );
}
