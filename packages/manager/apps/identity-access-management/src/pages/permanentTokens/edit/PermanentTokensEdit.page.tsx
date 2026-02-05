import { useEffect, useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Modal, useNotifications } from '@ovh-ux/manager-react-components';
import {
  OdsFormField,
  OdsInput,
  OdsSpinner,
  OdsTextarea,
} from '@ovhcloud/ods-components/react';
import { ODS_INPUT_TYPE, ODS_MODAL_COLOR } from '@ovhcloud/ods-components';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { PageType, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { subRoutes } from '@/routes/routes.constant';
import {
  API_MESSAGE_TOKEN_ALREADY_EXISTS,
  PERMANENT_TOKENS_INPUT_MAX_LENGTH,
  PERMANENT_TOKENS_INPUT_PATTERN,
} from '@/constants';

import { useParam } from '@/hooks/useParam';
import {
  useCreateIamUserToken,
  useGetIamUserToken,
  useUpdateIamUserToken,
} from '@/data/hooks/useGetIamUserTokens';
import { IamUserToken, IamUserTokenPayload } from '@/data/api/iam-users';
import ExpiryDateInput from '@/pages/permanentTokens/components/ExpiryDateInput.component';
import { ExpiryDateModel, ExpiryMode } from '@/types/expiryDate';
import { DEFAULT_EXPIRY_DATE_MODEL } from '@/utils/expiryDateUtils';
import { PERMANENT_TOKENS_TRACKING } from '@/tracking.constant';
import TokenSecretContext from '@/contexts/token-secret.context';

export default function PermanentTokensAdd() {
  const { t } = useTranslation([
    'permanent-tokens',
    NAMESPACES.ACTIONS,
    NAMESPACES.FORM,
  ]);
  const { trackClick, trackPage } = useOvhTracking();
  const { addSuccess, addError } = useNotifications();
  const navigate = useNavigate();
  const goBack = () => navigate('..');
  const userId = useParam('userId');
  const { tokenId } = useParams();
  const isCreationMode = !tokenId;
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [formDataLoaded, setFormDataLoaded] = useState<boolean>(!tokenId);
  const [expiryModel, setExpiryModel] = useState<ExpiryDateModel>(
    DEFAULT_EXPIRY_DATE_MODEL,
  );
  const { setTokenSecret } = useContext(TokenSecretContext);

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
          mode: ExpiryMode.DATE,
          expiresAt: new Date(tokenData.expiresAt),
          expiresIn: null,
        });
      }
      setFormDataLoaded(true);
    }
  }, [isCreationMode, isTokenLoading, isTokenError, tokenData]);

  const { createToken, isPending: isCreationPending } = useCreateIamUserToken({
    userId,
    onSuccess: (newToken: IamUserToken) => {
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: PERMANENT_TOKENS_TRACKING.ADD.REQUEST_SUCCESS,
      });
      addSuccess(t('iam_user_token_modal_add_success'));
      setTokenSecret(newToken.token || null);
      navigate(`../${subRoutes.permanentTokensView}`);
    },
    onError: (error) => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: PERMANENT_TOKENS_TRACKING.ADD.REQUEST_FAIL,
      });
      const tokenAlreadyExists =
        error?.response?.data?.message === API_MESSAGE_TOKEN_ALREADY_EXISTS;
      addError(
        tokenAlreadyExists
          ? t('iam_user_token_modal_add_error_token_exists', {
              tokenName: name,
            })
          : t('iam_user_token_modal_add_error'),
      );
      goBack();
    },
  });

  const { updateToken, isPending: isUpdatePending } = useUpdateIamUserToken({
    userId,
    onSuccess: () => {
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: PERMANENT_TOKENS_TRACKING.EDIT.REQUEST_SUCCESS,
      });
      addSuccess(t('iam_user_token_modal_edit_success'));
      goBack();
    },
    onError: () => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: PERMANENT_TOKENS_TRACKING.EDIT.REQUEST_FAIL,
      });
      addError(t('iam_user_token_modal_edit_error'));
      goBack();
    },
  });

  const handleSubmit = () => {
    if (isCreationPending || isUpdatePending) {
      return;
    }
    const payload: IamUserTokenPayload = { name, description };
    if (expiryModel.active) {
      if (
        expiryModel.mode === ExpiryMode.DATE &&
        expiryModel.expiresAt !== null
      ) {
        payload.expiresAt = expiryModel.expiresAt.toISOString();
      }
      if (
        expiryModel.mode === ExpiryMode.DURATION &&
        expiryModel.expiresIn !== null
      ) {
        payload.expiresIn = expiryModel.expiresIn;
      }
    } else if (!isCreationMode) {
      payload.expiresAt = null;
    }

    trackClick({
      actionType: 'action',
      actions: isCreationMode
        ? PERMANENT_TOKENS_TRACKING.ADD.CTA_CONFIRM
        : PERMANENT_TOKENS_TRACKING.EDIT.CTA_CONFIRM,
    });
    if (isCreationMode) {
      createToken(payload);
    } else {
      updateToken(payload);
    }
  };

  const handleCancel = () => {
    trackClick({
      actionType: 'action',
      actions: isCreationMode
        ? PERMANENT_TOKENS_TRACKING.ADD.CTA_CANCEL
        : PERMANENT_TOKENS_TRACKING.EDIT.CTA_CANCEL,
    });
    goBack();
  };

  const checkInputError = (
    value: string,
    isMandatory: boolean,
  ): string | undefined => {
    if (value.trim() === '') {
      return isMandatory
        ? t('required_field', { ns: NAMESPACES.FORM })
        : undefined;
    }
    if (value.length > PERMANENT_TOKENS_INPUT_MAX_LENGTH) {
      return t('max_chars', {
        ns: NAMESPACES.FORM,
        value: { value: PERMANENT_TOKENS_INPUT_MAX_LENGTH },
      });
    }
    if (!PERMANENT_TOKENS_INPUT_PATTERN.test(value)) {
      return t('error_pattern', { ns: NAMESPACES.FORM });
    }

    return undefined;
  };

  const nameError = checkInputError(name, true);
  const descriptionError = checkInputError(description, false);
  const isFormValid =
    !!name && !nameError && !descriptionError && !expiryModel.invalid;
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
      isPrimaryButtonDisabled={
        isCreationPending || isUpdatePending || !isFormValid
      }
      secondaryLabel={t('cancel', { ns: NAMESPACES.ACTIONS })}
      onSecondaryButtonClick={handleCancel}
      onDismiss={handleCancel}
      isOpen
    >
      {!formDataLoaded && <OdsSpinner />}

      {formDataLoaded && (
        <>
          <OdsFormField className="mb-6" error={nameError}>
            <label htmlFor="tokenName" slot="label">
              {t('iam_user_token_modal_field_name_label')}
            </label>
            <OdsInput
              type={ODS_INPUT_TYPE.text}
              name="tokenName"
              value={name}
              maxlength={PERMANENT_TOKENS_INPUT_MAX_LENGTH}
              onOdsChange={(e) => setName(e.detail.value as string)}
              isDisabled={!isCreationMode}
              hasError={!!nameError}
              data-testid="tokenName"
            />
          </OdsFormField>
          <OdsFormField className="mb-6" error={descriptionError}>
            <label htmlFor="tokenDescription" slot="label">
              {t('iam_user_token_modal_field_description_label')}
            </label>
            <OdsTextarea
              name="tokenDescription"
              value={description}
              onOdsChange={(e) => setDescription(e.detail.value as string)}
              maxlength={PERMANENT_TOKENS_INPUT_MAX_LENGTH}
              hasError={!!descriptionError}
              rows={3}
              data-testid="tokenDescription"
            />
          </OdsFormField>

          <ExpiryDateInput model={expiryModel} setModel={setExpiryModel} />
        </>
      )}
    </Modal>
  );
}
