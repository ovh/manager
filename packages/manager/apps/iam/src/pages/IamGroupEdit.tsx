import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Form,
  MessageBox,
  MessageBoxMessage,
} from '@ovh-ux/manager-react-core-components';
import { useQueryClient } from '@tanstack/react-query';

import useResourceGroupForm, {
  IamResourceGroupFormData,
} from '@/hooks/useResourceGroupForm';
import { editResourceGroup } from '@/api';

export default function IamGroupEdit(): JSX.Element {
  const { t } = useTranslation('iam/groups/edit');
  const [editError, setEditError] = useState<MessageBoxMessage>();
  const { resourceGroupId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    isFormLoading,
    schema,
    formData,
    getGroupPayload,
  } = useResourceGroupForm(resourceGroupId);

  const editGroup = async ({
    formData: submittedData,
  }: {
    formData: IamResourceGroupFormData;
  }) => {
    const groupPayload = getGroupPayload(submittedData);

    try {
      // POST to the API
      await editResourceGroup(resourceGroupId, groupPayload);
      // invalidate query cache
      queryClient.invalidateQueries(['iam_resource_group']);
      // navigate to parent page
      navigate('../..', {
        state: {
          actionResult: {
            type: 'success',
            message: (
              <Trans
                t={t}
                i18nKey="edit_success"
                values={{ name: groupPayload.name }}
              ></Trans>
            ),
          } as MessageBoxMessage,
        },
      });
    } catch (error) {
      setEditError({
        type: 'error',
        message: <Trans t={t} i18nKey="edit_error"></Trans>,
        error,
      });
    }
  };

  return (
    <>
      {editError && <MessageBox {...editError} dismissable={true} />}
      <Form
        schema={schema}
        formData={formData}
        isLoading={isFormLoading}
        onSubmit={editGroup}
      ></Form>
    </>
  );
}
