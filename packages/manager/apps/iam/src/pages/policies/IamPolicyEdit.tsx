import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Form,
  MessageBox,
  MessageBoxMessage,
} from '@ovh-ux/manager-react-core-components';
import { useQueryClient } from '@tanstack/react-query';

import usePolicyForm, { IamPolicyFormData } from '@/hooks/usePolicyForm';
import { editResourceGroup } from '@/api';

export default function IamGroupEdit(): JSX.Element {
  const { t } = useTranslation('iam/groups/edit');
  const [editError, setEditError] = useState<MessageBoxMessage>();
  const { policyId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    isFormLoading,
    schema,
    uiSchema,
    formData,
    getPolicyPayload,
  } = usePolicyForm(policyId);

  const editGroup = async ({
    formData: submittedData,
  }: {
    formData: IamPolicyFormData;
  }) => {
    const policyPayload = getPolicyPayload(submittedData);

    try {
      // PUT to the API
      await editResourceGroup(policyId, policyPayload);
      // invalidate query cache
      queryClient.removeQueries(['iam_policy']);
      // navigate to parent page
      navigate('../..', {
        state: {
          actionResult: {
            type: 'success',
            message: (
              <Trans
                t={t}
                i18nKey="edit_success"
                values={{ name: policyPayload.name }}
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
        uiSchema={uiSchema}
        formData={formData}
        isLoading={isFormLoading}
        onSubmit={editGroup}
      ></Form>
    </>
  );
}
