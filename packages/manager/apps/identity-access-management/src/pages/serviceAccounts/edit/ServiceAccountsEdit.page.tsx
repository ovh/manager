import { useEffect, useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Modal, useNotifications } from '@ovh-ux/manager-react-components';
import { PageType, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  OdsSpinner,
  OdsFormField,
  OdsInput,
  OdsText,
  OdsTextarea,
} from '@ovhcloud/ods-components/react';
import {
  ODS_MODAL_COLOR,
  ODS_INPUT_TYPE,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';

import {
  PERMANENT_TOKENS_INPUT_MAX_LENGTH,
  PERMANENT_TOKENS_INPUT_PATTERN,
} from '@/constants';
import { subRoutes } from '@/routes/routes.constant';
import {
  IamServiceAccountSecret,
  IamServiceAccountFlow,
} from '@/data/api/iam-service-accounts';
import {
  useGetIamServiceAccount,
  useCreateIamServiceAccount,
  useUpdateIamServiceAccount,
} from '@/data/hooks/useGetIamServiceAccounts';
import {
  PERMANENT_TOKENS_TRACKING,
  SERVICE_ACCOUNTS_TRACKING,
} from '@/tracking.constant';
import ServiceAccountSecretContext from '@/contexts/service-account-secret.context';

export default function ServiceAccountsEdit() {
  const { t } = useTranslation([
    'service-accounts',
    'permanent-tokens',
    NAMESPACES.ACTIONS,
  ]);
  const { trackClick, trackPage } = useOvhTracking();
  const { addSuccess, addError } = useNotifications();
  const navigate = useNavigate();
  const goBack = () => navigate('..');
  const { clientId } = useParams();
  const isCreationMode = !clientId;
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [formDataLoaded, setFormDataLoaded] = useState<boolean>(isCreationMode);
  const { setSecret } = useContext(ServiceAccountSecretContext);

  const {
    data: accountData,
    isLoading: isAccountLoading,
    isError: isAccountError,
  } = useGetIamServiceAccount({ clientId });

  useEffect(() => {
    if (
      !isCreationMode &&
      !isAccountLoading &&
      !isAccountError &&
      !!accountData
    ) {
      setName(accountData.name);
      setDescription(accountData.description);
      setFormDataLoaded(true);
    }
  }, [isCreationMode, isAccountLoading, isAccountError, accountData]);

  const {
    createServiceAccount,
    isPending: isCreationPending,
  } = useCreateIamServiceAccount({
    onSuccess: (secret: IamServiceAccountSecret) => {
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: SERVICE_ACCOUNTS_TRACKING.ADD.REQUEST_SUCCESS,
      });
      addSuccess(t('iam_service_accounts_add_success_content'));
      setSecret(secret);
      navigate(`../${subRoutes.serviceAccountsView}`);
    },
    onError: () => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: SERVICE_ACCOUNTS_TRACKING.ADD.REQUEST_FAIL,
      });
      addError(t('iam_service_accounts_add_error'));
      goBack();
    },
  });

  const {
    updateServiceAccount,
    isPending: isUpdatePending,
  } = useUpdateIamServiceAccount({
    clientId: clientId || '',
    onSuccess: () => {
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: SERVICE_ACCOUNTS_TRACKING.EDIT.REQUEST_SUCCESS,
      });
      addSuccess(t('iam_service_accounts_edit_success'));
      goBack();
    },
    onError: () => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: SERVICE_ACCOUNTS_TRACKING.EDIT.REQUEST_FAIL,
      });
      addError(t('iam_service_accounts_edit_error'));
      goBack();
    },
  });

  const handleCancel = () => {
    trackClick({
      actionType: 'action',
      actions: isCreationMode
        ? SERVICE_ACCOUNTS_TRACKING.ADD.CTA_CANCEL
        : SERVICE_ACCOUNTS_TRACKING.EDIT.CTA_CANCEL,
    });
    goBack();
  };

  const handleCreate = () => {
    if (isCreationPending) {
      return;
    }
    trackClick({
      actionType: 'action',
      actions: SERVICE_ACCOUNTS_TRACKING.ADD.CTA_CONFIRM,
    });
    createServiceAccount({
      name,
      description,
      callbackUrls: [],
      flow: IamServiceAccountFlow.CLIENT_CREDENTIALS,
    });
  };

  const handleUpdate = () => {
    if (isUpdatePending) {
      return;
    }
    trackClick({
      actionType: 'action',
      actions: SERVICE_ACCOUNTS_TRACKING.EDIT.CTA_CONFIRM,
    });
    updateServiceAccount({
      name,
      description,
      callbackUrls: [],
    });
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
  const descriptionError = checkInputError(description, true);
  const isFormValid =
    !!name && !nameError && !!description && !descriptionError;
  return (
    <Modal
      type={ODS_MODAL_COLOR.neutral}
      heading={t(
        isCreationMode
          ? 'iam_service_accounts_add_account'
          : 'iam_service_accounts_edit_account',
      )}
      primaryLabel={t(isCreationMode ? 'create' : 'modify', {
        ns: NAMESPACES.ACTIONS,
      })}
      onPrimaryButtonClick={isCreationMode ? handleCreate : handleUpdate}
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
          <OdsText className="mb-8" preset={ODS_TEXT_PRESET.heading3}>
            {t('iam_service_accounts_fill_informations')}
          </OdsText>
          <OdsFormField className="mb-6" error={nameError}>
            <label htmlFor="accountName" slot="label">
              {t('iam_service_accounts_service_account_name')}
            </label>
            <OdsInput
              type={ODS_INPUT_TYPE.text}
              name="accountName"
              value={name}
              maxlength={PERMANENT_TOKENS_INPUT_MAX_LENGTH}
              onOdsChange={(e) => setName(e.detail.value as string)}
              hasError={!!nameError}
              data-testid="accountName"
            />
          </OdsFormField>
          <OdsFormField className="mb-6" error={descriptionError}>
            <label htmlFor="accountDescription" slot="label">
              {t('iam_user_token_modal_field_description_label', {
                ns: 'permanent-tokens',
              })}
            </label>
            <OdsTextarea
              name="accountDescription"
              value={description}
              onOdsChange={(e) => setDescription(e.detail.value as string)}
              maxlength={PERMANENT_TOKENS_INPUT_MAX_LENGTH}
              hasError={!!descriptionError}
              rows={3}
              data-testid="accountDescription"
            />
          </OdsFormField>
        </>
      )}
    </Modal>
  );
}
