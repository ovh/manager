import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { BaseLayout, HeadersProps } from '@ovh-ux/manager-react-components';
import {
  OdsButton,
  OdsFormField,
  OdsInput,
  OdsText,
  OdsTextarea,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_COLOR,
  ODS_BUTTON_VARIANT,
  ODS_INPUT_TYPE,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { SERVICE_ACCOUNTS_INPUT_MAX_LENGTH } from '@/constants';
import { subRoutes } from '@/routes/routes.constant';
import {
  IamServiceAccount,
  IamServiceAccountCreationResponse,
  IamServiceAccountFlow,
} from '@/data/api/iam-service-accounts';
import { IamPolicy } from '@/data/api/iam-policies';
import {
  useCreateIamServiceAccount,
  useGetIamServiceAccount,
  useUpdateIamServiceAccount,
} from '@/data/hooks/useGetIamServiceAccounts';
import { ServiceAccountsBreadcrumb } from '@/pages/serviceAccounts/components/ServiceAccountsBreadcrumb.component';
import { ServiceAccountsPolicySelection } from '@/pages/serviceAccounts/edit/ServiceAccountsPolicySelection.component';
import {
  useGetIamPolicies,
  useGetIamPoliciesForIdentity,
} from '@/data/hooks/useGetIamPolicies';

export default function ServiceAccountsEdit() {
  const { t } = useTranslation([
    'service-accounts',
    'permanent-tokens',
    NAMESPACES.ACTIONS,
  ]);
  const navigate = useNavigate();
  const goBack = () => navigate(subRoutes.serviceAccounts);
  const { clientId } = useParams();
  const isCreationMode = !clientId;
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [callbackUrl, setCallbackUrl] = useState<string>('');
  const [formDataLoaded, setFormDataLoaded] = useState<boolean>(isCreationMode);
  const [selectedPolicies, setSelectedPolicies] = useState<IamPolicy[]>([]);

  const {
    data: accountData,
    isLoading: isAccountLoading,
    isError: isAccountError,
  } = useGetIamServiceAccount({ clientId });

  const {
    data: allPolicies,
    isLoading: isAllPolicyLoading,
    isError: isAllPolicyError,
  } = useGetIamPolicies();

  const {
    data: accountPolicies,
    isLoading: isAccountPolicyLoading,
    isError: isAccountPolicyError,
  } = useGetIamPoliciesForIdentity(accountData?.identity || null);

  useEffect(() => {
    if (
      !isCreationMode &&
      !isAccountLoading &&
      !isAccountError &&
      !!accountData
    ) {
      setName(accountData.name);
      setDescription(accountData.description);
      setCallbackUrl((accountData.callbackUrls || []).join('\n'));
      setFormDataLoaded(true);
    }
  }, [isCreationMode, isAccountLoading, isAccountError, accountData]);

  useEffect(() => {
    if (!accountPolicies || !accountPolicies.length) {
      return;
    }
    setSelectedPolicies([...accountPolicies]);
  }, [accountPolicies]);

  const {
    createServiceAccount,
    isPending: isCreationPending,
  } = useCreateIamServiceAccount({
    onSuccess: (response: IamServiceAccountCreationResponse) => {
      // TODO: tracking
      console.log('new Account data: ', response);
      goBack();
    },
    onError: () => {
      // TODO: tracking
      goBack();
    },
  });

  const {
    updateServiceAccount,
    isPending: isUpdatePending,
  } = useUpdateIamServiceAccount({
    clientId: clientId || '',
    onSuccess: (account: IamServiceAccount) => {
      // TODO: tracking
      console.log('updated account: ', account);
      goBack();
    },
    onError: () => {
      // TODO: tracking
      goBack();
    },
  });

  const handleCancel = () => {
    // TODO: tracking
    goBack();
  };

  const handleCreate = () => {
    if (isCreationPending) {
      return;
    }
    // TODO: tracking
    createServiceAccount({
      name,
      description,
      callbackUrls: callbackUrl.split('\n'),
      flow: IamServiceAccountFlow.AUTHORIZATION_CODE,
    });
  };

  const handleUpdate = () => {
    if (isUpdatePending) {
      return;
    }
    // TODO: tracking
    updateServiceAccount({
      name,
      description,
      callbackUrls: callbackUrl.split('\n'),
    });
  };

  const handlePolicySelectionChange = (
    policy: IamPolicy,
    selected: boolean,
  ) => {
    if (selected) {
      setSelectedPolicies((arr) => [...arr, policy]);
    } else {
      setSelectedPolicies((arr) => arr.filter(d => d.id !== policy.id));
    }
  };

  const header: HeadersProps = {
    title: isCreationMode
      ? t('iam_service_accounts_add_account')
      : t('iam_service_accounts_edit_account'),
  };

  const nameError: null = null;
  const descriptionError: null = null;
  return (
    <BaseLayout header={header} breadcrumb={<ServiceAccountsBreadcrumb />}>
      <div className="flex flex-col">
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
            maxlength={SERVICE_ACCOUNTS_INPUT_MAX_LENGTH}
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
            maxlength={SERVICE_ACCOUNTS_INPUT_MAX_LENGTH}
            hasError={!!descriptionError}
            rows={3}
            data-testid="accountDescription"
          />
        </OdsFormField>
        <OdsFormField className="mb-6">
          <label htmlFor="callbackUrl" slot="label">
            {t('iam_service_accounts_callback_url')}
          </label>
          <OdsTextarea
            name="callbackUrl"
            value={callbackUrl}
            onOdsChange={(e) => setCallbackUrl(e.detail.value as string)}
            rows={3}
            data-testid="callbackUrl"
          />
        </OdsFormField>
        <hr className="mt-8" />
        <ServiceAccountsPolicySelection
          serviceAccount={accountData || null}
          allPolicies={allPolicies}
          selectedPolicies={selectedPolicies}
          onPolicySelectionChange={handlePolicySelectionChange}
          isLoading={isAllPolicyLoading || isAccountPolicyLoading}
        />
      </div>
      <div className="flex items-center gap-4 py-3 mt-8">
        <OdsButton
          color={ODS_BUTTON_COLOR.primary}
          variant={ODS_BUTTON_VARIANT.ghost}
          label={t('cancel', { ns: NAMESPACES.ACTIONS })}
          onClick={handleCancel}
        />
        <OdsButton
          color={ODS_BUTTON_COLOR.primary}
          variant={ODS_BUTTON_VARIANT.default}
          label={t(isCreationMode ? 'create' : 'modify', {
            ns: NAMESPACES.ACTIONS,
          })}
          onClick={isCreationMode ? handleCreate : handleUpdate}
          isDisabled={!name || isCreationPending || isUpdatePending}
        />
      </div>
    </BaseLayout>
  );
}
