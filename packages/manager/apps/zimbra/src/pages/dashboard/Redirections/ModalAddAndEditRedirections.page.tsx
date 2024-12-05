import React, { useMemo, useState } from 'react';
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
import {
  FormTypeInterface,
  checkValidityField,
  checkValidityForm,
  ACCOUNT_REGEX,
  EMAIL_REGEX,
} from '@/utils';
import Loading from '@/components/Loading/Loading';
import {
  ADD_REDIRECTION,
  CANCEL,
  CONFIRM,
  EDIT_REDIRECTION,
  EMAIL_ACCOUNT_ADD_REDIRECTION,
  EMAIL_ACCOUNT_EDIT_REDIRECTION,
} from '@/tracking.constant';

export default function ModalAddAndEditRedirections() {
  const { trackClick, trackPage } = useOvhTracking();
  const { t } = useTranslation('redirections/addAndEdit');
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
  const [isFormValid, setIsFormValid] = useState(false);

  const { data: domainList, isLoading: isLoadingDomain } = useDomains({
    enabled: !editEmailAccountId && !editRedirectionId,
  });

  const { data: accountDetail, isLoading: isLoadingAccount } = useAccount({
    accountId: editEmailAccountId,
    enabled: !!editEmailAccountId,
  });

  const [form, setForm] = useState<FormTypeInterface>({
    account: {
      value: '',
      defaultValue: '',
      touched: false,
      hasError: false,
      required: !editEmailAccountId,
      validate: ACCOUNT_REGEX,
    },
    domain: {
      value: '',
      defaultValue: '',
      touched: false,
      hasError: false,
      required: !editEmailAccountId,
    },
    to: {
      value: '',
      defaultValue: '',
      touched: false,
      hasError: false,
      required: true,
      validate: EMAIL_REGEX,
    },
    keepCopy: {
      value: '',
      defaultValue: '',
      touched: false,
      hasError: false,
      required: false,
    },
  });

  const handleFormChange = (name: string, value: string) => {
    const newForm: FormTypeInterface = form;
    newForm[name] = {
      value,
      touched: true,
      required: form[name].required,
      hasError: !checkValidityField(name, value, form),
    };
    setForm((oldForm) => ({ ...oldForm, ...newForm }));
    setIsFormValid(checkValidityForm(form));
  };

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
          {t('zimbra_redirection_add_success_message')}
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
          {t('zimbra_redirection_add_error_message', {
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
          ? 'zimbra_redirections_title_edit'
          : 'zimbra_redirections_title_add',
      )}
      onClose={onClose}
      secondaryButton={{
        testid: 'cancel-btn',
        label: t('zimbra_redirections_add_btn_cancel'),
        action: handleCancelClick,
      }}
      primaryButton={{
        testid: 'confirm-btn',
        variant: ODS_BUTTON_VARIANT.default,
        label: t('zimbra_redirections_add_btn_confirm'),
        action: handleClickConfirm,
        isDisabled: !isFormValid,
        isLoading: isSending,
      }}
      isLoading={isLoadingDomain || isLoadingAccount}
    >
      <>
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t('zimbra_redirections_edit_1')}
        </OdsText>
        <OdsText preset={ODS_TEXT_PRESET.caption} className="my-5">
          {t('zimbra_redirections_edit_2')}
        </OdsText>
        <OdsFormField data-testid="field-from" className="mt-5">
          <label htmlFor="from" slot="label">
            {t('zimbra_redirections_add_form_input_name_title_from')} *
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
                  placeholder={t(
                    'zimbra_redirections_add_input_email_placeholder',
                  )}
                  hasError={form.account.hasError}
                  value={form.account.value}
                  defaultValue={form.account.defaultValue}
                  onOdsBlur={({ target: { name, value } }) =>
                    handleFormChange(name, String(value))
                  }
                  onOdsChange={({ detail: { name, value } }) => {
                    handleFormChange(name, String(value));
                  }}
                  isRequired
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
                  className="w-1/2"
                  hasError={form.domain.hasError}
                  isRequired
                  data-testid="select-domain"
                  isDisabled={isLoadingDomain}
                  placeholder={t(
                    'zimbra_redirections_add_select_domain_placeholder',
                  )}
                  onOdsChange={({ detail: { name, value } }) =>
                    handleFormChange(name, value)
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
            {t('zimbra_redirections_add_form_input_name_title_to')} *
          </label>
          <OdsInput
            type={ODS_INPUT_TYPE.email}
            data-testid="input-to"
            id="to"
            name="to"
            value={form.to.value}
            defaultValue={form.to.defaultValue}
            hasError={form.to.hasError}
            onOdsBlur={({ target: { name, value } }) =>
              handleFormChange(name, value.toString())
            }
            onOdsChange={({ detail: { name, value } }) =>
              handleFormChange(name, String(value))
            }
            isRequired
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
                handleFormChange(
                  'keepCopy',
                  e.detail.checked ? 'true' : 'false',
                );
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
