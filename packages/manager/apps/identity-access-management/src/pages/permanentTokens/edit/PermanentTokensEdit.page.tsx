import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Modal, useNotifications } from '@ovh-ux/manager-react-components';
import {
  OdsFormField,
  OdsInput,
  OdsTextarea,
} from '@ovhcloud/ods-components/react';
import { ODS_INPUT_TYPE, ODS_MODAL_COLOR } from '@ovhcloud/ods-components';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { useParam } from '@/hooks/useParam';
import {
  useGetIamUserToken,
  useCreateIamUserToken,
  useUpdateIamUserToken,
} from '@/data/hooks/useGetIamUserTokens';
import { IamUserTokenPayload } from '@/data/api/iam-users';
import ExpiryDateInput, {
  ExpiryDateModel,
  DEFAULT_EXPIRY_DATE_MODEL,
} from '@/pages/permanentTokens/components/ExpiryDateInput.component';

export default function PermanentTokensAdd() {
  const { t } = useTranslation(['permanent-tokens', NAMESPACES.ACTIONS]);
  const { addSuccess, addError } = useNotifications();
  const navigate = useNavigate();
  const goBack = () => navigate('..');
  const userId = useParam('userId');
  const { tokenId } = useParams();
  const isCreationMode = !tokenId;
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [expiryModel, setExpiryModel] = useState<ExpiryDateModel>(DEFAULT_EXPIRY_DATE_MODEL);

  const {
    data: tokenData,
    isLoading: isTokenLoading,
    isError: isTokenError,
  } = useGetIamUserToken({
    userId,
    token: tokenId,
  });

  useEffect(() => {
    if (!isCreationMode && !isTokenLoading && !isTokenError && !!tokenData) {
      setName(tokenData.name);
      setDescription(tokenData.description);
      if (tokenData.expiresAt) {
        setExpiryModel({
          active: true,
          mode: 'date',
          expiresAt: new Date(tokenData.expiresAt),
          expiresIn: null,
        });
      }
    }
  }, [isCreationMode, isTokenLoading, isTokenError, tokenData]);

  const { createToken, isPending: isCreationPending } = useCreateIamUserToken({
    userId: userId,
    onSuccess: () => {
      addSuccess(t('iam_user_token_modal_title_add_success'));
      goBack();
    },
    onError: () => {
      addError(t('iam_user_token_modal_title_add_error'));
      goBack();
    },
  });

  const { updateToken, isPending: isUpdatePending } = useUpdateIamUserToken({
    userId: userId,
    onSuccess: () => {
      addSuccess(t('iam_user_token_modal_title_edit_success'));
      goBack();
    },
    onError: () => {
      addError(t('iam_user_token_modal_title_edit_error'));
      goBack();
    },
  });

  const handleSubmit = () => {
    if (isCreationPending || isUpdatePending) {
      return;
    }
    const payload: IamUserTokenPayload = {
      name: name,
      description: description,
    };
    if (expiryModel.active) {
      if (expiryModel.mode === 'date' && expiryModel.expiresAt !== null) {
        payload.expiresAt = expiryModel.expiresAt.toISOString();
      }
      if (expiryModel.mode === 'duration' && expiryModel.expiresIn !== null) {
        payload.expiresIn = expiryModel.expiresIn;
      }
    }
    isCreationMode ? createToken(payload) : updateToken(payload);
  };

  const handleCancel = () => {
    goBack();
  };

  return (
    <Modal
      type={ODS_MODAL_COLOR.neutral}
      heading={t(
        isCreationMode
          ? 'iam_user_token_modal_title_add'
          : 'iam_user_token_modal_title_edit',
      )}
      primaryLabel={t(isCreationMode ? 'create' : 'modify', {
        ns: NAMESPACES.ACTIONS,
      })}
      onPrimaryButtonClick={handleSubmit}
      isPrimaryButtonDisabled={isCreationPending || isUpdatePending}
      secondaryLabel={t('cancel', { ns: NAMESPACES.ACTIONS })}
      onSecondaryButtonClick={handleCancel}
      onDismiss={handleCancel}
      isOpen
    >
      <OdsFormField className="mb-6">
        <label htmlFor="tokenName" slot="label">
          {t('iam_user_token_modal_field_name_label')}
        </label>
        <OdsInput
          type={ODS_INPUT_TYPE.text}
          name="tokenName"
          value={name}
          onOdsChange={(e) => setName(e.detail.value as string)}
          placeholder={t('iam_user_token_modal_field_name_placeholder')}
          isDisabled={!isCreationMode}
        />
      </OdsFormField>
      <OdsFormField className="mb-6">
        <label htmlFor="tokenDescription" slot="label">
          {t('iam_user_token_modal_field_description_label')}
        </label>
        <OdsTextarea
          name="tokenDescription"
          value={description}
          onOdsChange={(e) => setDescription(e.detail.value as string)}
          placeholder={t('iam_user_token_modal_field_description_placeholder')}
          rows={3}
        />
      </OdsFormField>

      <ExpiryDateInput model={expiryModel} setModel={setExpiryModel} />
    </Modal>
  );
}
