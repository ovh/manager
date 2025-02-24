import React, { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  OdsCheckbox,
  OdsFormField,
  OdsInput,
  OdsSelect,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import {
  ODS_BUTTON_VARIANT,
  ODS_INPUT_TYPE,
  ODS_MODAL_COLOR,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { useNotifications } from '@ovh-ux/manager-react-components';
import {
  ButtonType,
  PageLocation,
  PageType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useMutation } from '@tanstack/react-query';
import Modal from '@/components/Modals/Modal';
import { useAccount, useDomains, useGenerateUrl } from '@/hooks';
import { ACCOUNT_REGEX, EMAIL_REGEX } from '@/utils';
import Loading from '@/components/Loading/Loading';
import {
  ADD_REDIRECTION,
  CANCEL,
  CONFIRM,
  EDIT_REDIRECTION,
  EMAIL_ACCOUNT_ADD_REDIRECTION,
  EMAIL_ACCOUNT_EDIT_REDIRECTION,
} from '@/tracking.constant';
import { useForm } from '@/hooks/useForm';

export default function ModalAddAndEditRedirections() {
  const { trackClick, trackPage } = useOvhTracking();
  const { t } = useTranslation('redirections');
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const editEmailAccountId = searchParams.get('editEmailAccountId');
  const editRedirectionId = searchParams.get('editRedirectionId');
  const params = Object.fromEntries(searchParams.entries());
  delete params.editRedirectionId;

  const trackingName = useMemo(() => {
    if (editEmailAccountId) {
      return editRedirectionId
        ? EMAIL_ACCOUNT_EDIT_REDIRECTION
        : EMAIL_ACCOUNT_ADD_REDIRECTION;
    }
    return editRedirectionId ? EDIT_REDIRECTION : ADD_REDIRECTION;
  }, [editRedirectionId, editEmailAccountId]);

  const goBackUrl = useGenerateUrl('..', 'path', params);
  const onClose = () => navigate(goBackUrl);

  const { addError, addSuccess } = useNotifications();

  const { data: domainList, isLoading: isLoadingDomain } = useDomains({
    enabled: !editEmailAccountId && !editRedirectionId,
    shouldFetchAll: true,
  });

  const { data: accountDetail, isLoading: isLoadingAccount } = useAccount({
    accountId: editEmailAccountId,
    enabled: !!editEmailAccountId,
  });

  const { form, isFormValid, setValue } = useForm({
    account: {
      value: '',
      defaultValue: '',
      required: !editEmailAccountId,
      validate: ACCOUNT_REGEX,
    },
    domain: {
      value: '',
      defaultValue: '',
      required: !editEmailAccountId,
    },
    to: {
      value: '',
      defaultValue: '',
      required: true,
      validate: EMAIL_REGEX,
    },
    keepCopy: {
      value: '',
      defaultValue: '',
    },
  });

  /* const getDataBody = useCallback(
    (formRef: FormTypeInterface) => {
      const {
        account: { value: account },
        domain: { value: domain },
      } = form;

      let dataBody: Record<string, string | boolean> = {};

      dataBody.from =
        account && domain
          ? `${account}@${domain}`
          : accountDetail?.currentState.email;

      Object.entries(formRef).forEach(([key, { value }]) => {
        if (!['account', 'domain'].includes(key)) {
          dataBody = { ...dataBody, [key]: value };
        }
      });

      dataBody.keepCopy = dataBody?.keepCopy === 'true';

      return dataBody;
    },
    [form],
  ); */

  const { mutate: addRedirection, isPending: isSending } = useMutation({
    mutationFn: () => {
      return Promise.resolve();
    },
    onSuccess: () => {
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: trackingName,
      });
      addSuccess(
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t('zimbra_redirections_add_success_message')}
        </OdsText>,
        true,
      );
    },
    onError: (error: ApiError) => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: trackingName,
      });
      addError(
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t('zimbra_redirections_add_error_message', {
            error: error?.response?.data?.message,
          })}
        </OdsText>,
        true,
      );
    },
    onSettled: () => {
      /* queryClient.invalidateQueries({
        queryKey: getZimbraPlatformRedirectionsQueryKey(platformId),
      }); */

      onClose();
    },
  });

  const handleClickConfirm = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [trackingName, CONFIRM],
    });

    addRedirection();
  };

  const handleCancelClick = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [trackingName, CANCEL],
    });

    onClose();
  };

  return (
    <Modal
      isOpen
      color={ODS_MODAL_COLOR.information}
      isDismissible
      title={t(
        editRedirectionId
          ? 'common:edit_redirection'
          : 'common:add_redirection',
      )}
      onClose={onClose}
      secondaryButton={{
        testid: 'cancel-btn',
        label: t('common:cancel'),
        action: handleCancelClick,
      }}
      primaryButton={{
        testid: 'confirm-btn',
        variant: ODS_BUTTON_VARIANT.default,
        label: t('common:confirm'),
        action: handleClickConfirm,
        isDisabled: !isFormValid,
        isLoading: isSending,
      }}
      isLoading={isLoadingDomain || isLoadingAccount}
    >
      <>
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t('zimbra_redirections_add_header')}
        </OdsText>
        <OdsText preset={ODS_TEXT_PRESET.caption} className="my-5">
          {t('common:form_mandatory_fields')}
        </OdsText>
        <OdsFormField data-testid="field-from" className="mt-5">
          <label htmlFor="from" slot="label">
            {t('zimbra_redirections_add_form_input_from')} *
          </label>
          {editEmailAccountId || editRedirectionId ? (
            <OdsInput
              type={ODS_INPUT_TYPE.email}
              data-testid="input-from"
              id="from"
              name="from"
              value={accountDetail?.currentState?.email}
              isDisabled
              isReadonly
            />
          ) : (
            <>
              <div className="flex">
                <OdsInput
                  type={ODS_INPUT_TYPE.text}
                  name="account"
                  placeholder={t('common:account_name')}
                  hasError={form.account.hasError}
                  value={form.account.value}
                  defaultValue={form.account.defaultValue}
                  isRequired={form.account.required}
                  onOdsBlur={({ target: { name, value } }) =>
                    setValue(name, String(value), true)
                  }
                  onOdsChange={({ detail: { name, value } }) => {
                    setValue(name, String(value));
                  }}
                  className="w-1/2"
                  data-testid="input-account"
                ></OdsInput>
                <OdsInput
                  type={ODS_INPUT_TYPE.text}
                  value={'@'}
                  name={'@'}
                  isReadonly
                  isDisabled
                  className="input-at w-10"
                ></OdsInput>
                <OdsSelect
                  name="domain"
                  value={form.domain.value}
                  defaultValue={form.domain.defaultValue}
                  isRequired={form.domain.required}
                  hasError={form.domain.hasError}
                  className="w-1/2"
                  data-testid="select-domain"
                  isDisabled={isLoadingDomain}
                  placeholder={t('common:select_domain')}
                  onOdsChange={({ detail: { name, value } }) =>
                    setValue(name, value)
                  }
                >
                  {domainList?.map(({ currentState: domain }) => (
                    <option key={domain.name} value={domain.name}>
                      {domain.name}
                    </option>
                  ))}
                </OdsSelect>
              </div>
              {isLoadingDomain && (
                <div slot="helper">
                  <Loading />
                </div>
              )}
            </>
          )}
        </OdsFormField>
        <OdsFormField data-testid="field-to" className="mt-5">
          <label htmlFor="to" slot="label">
            {t('zimbra_redirections_add_form_input_to')} *
          </label>
          <OdsInput
            type={ODS_INPUT_TYPE.email}
            data-testid="input-to"
            id="to"
            name="to"
            value={form.to.value}
            defaultValue={form.to.defaultValue}
            hasError={form.to.hasError}
            isRequired={form.to.required}
            onOdsBlur={({ target: { name, value } }) =>
              setValue(name, value.toString(), true)
            }
            onOdsChange={({ detail: { name, value } }) =>
              setValue(name, String(value))
            }
          />
        </OdsFormField>
        <OdsFormField
          data-testid="field-checkbox"
          className="flex flex-col my-5"
        >
          <div className="flex leading-none gap-4">
            <OdsCheckbox
              inputId="keepCopy"
              id="keepCopy"
              name="keepCopy"
              isChecked={form.keepCopy.value === 'true'}
              onOdsChange={(e) => {
                setValue('keepCopy', e.detail.checked ? 'true' : 'false');
              }}
            ></OdsCheckbox>
            <label htmlFor="keepCopy">
              <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                {t('zimbra_redirections_add_form_input_checkbox')}
              </OdsText>
            </label>
          </div>
        </OdsFormField>
      </>
    </Modal>
  );
}
