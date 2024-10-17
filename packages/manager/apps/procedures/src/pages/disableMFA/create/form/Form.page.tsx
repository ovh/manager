import {
  ODS_BUTTON_TYPE,
  ODS_TEXT_SIZE,
  OdsSelectValueChangeEventDetail,
  OsdsSelectCustomEvent,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsMessage,
  OsdsSelect,
  OsdsSelectOption,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
} from '@ovhcloud/ods-common-theming';
import { FieldValues, useForm } from 'react-hook-form';
import { FormDocumentFieldList } from './FormDocumentFields/FormDocumentFieldList';
import { LegalFrom } from '@/types/user.type';
import useUser from '@/context/User/useUser';
import { useUploadDocuments } from '@/data/hooks/useDocuments';
import { getWebSiteRedirectUrl } from '@/utils/url-builder';
import { ConfirmModal } from '@/components/modals/confirmModal/ConfirmModal.component';
import { SuccessModal } from '@/components/modals/successModal/SuccessModal.component';

const flatFiles = (files: FieldValues) =>
  Object.values(files)
    .flat()
    .filter((f) => f);

const FormCreateRequest = () => {
  const { handleSubmit, control, reset, formState, watch } = useForm({
    mode: 'onChange',
  });

  const { t } = useTranslation('account-disable-2fa');
  const { t: tdoc } = useTranslation('account-disable-2fa-documents');
  const [selectedByFRLegalForm, setSelectedByFRLegalForm] = useState<LegalFrom>(
    null,
  );
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  const { mutate, isPending, isError, reset: resetUpload } = useUploadDocuments(
    {
      onSuccess: () => {
        setShowSuccessModal(true);
        setShowConfirmModal(false);
      },
      onError: () => {
        setShowConfirmModal(false);
      },
    },
  );

  const files = flatFiles(watch());
  const isAnyFileSelected = files.length > 0;

  const handleLegalFormChange = (
    e: OsdsSelectCustomEvent<OdsSelectValueChangeEventDetail>,
  ) => {
    reset();
    resetUpload();
    setSelectedByFRLegalForm(e.target.value as LegalFrom);
  };

  const { user } = useUser();

  const isOtherLegalFormForFR =
    user.legalForm === 'other' && user.subsidiary === 'FR';
  const legalForm = isOtherLegalFormForFR
    ? selectedByFRLegalForm
    : user.legalForm;
  const { subsidiary } = user;

  return (
    <form onSubmit={handleSubmit(() => setShowConfirmModal(true))}>
      {isOtherLegalFormForFR && (
        <div className="my-6">
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.text}
            level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
            size={ODS_TEXT_SIZE._500}
          >
            {tdoc('account-disable-2fa-create-form-field-select-type-account')}
          </OsdsText>
          <OsdsSelect
            onOdsValueChange={handleLegalFormChange}
            value={selectedByFRLegalForm}
            data-testid="account-disable-2fa-create-form-select"
          >
            <span slot="placeholder">
              {t('account-disable-2fa-create-form-select-legalform-type')}
            </span>
            <OsdsSelectOption value="administration">
              {t('account-disable-2fa-create-form-legalform-administration')}
            </OsdsSelectOption>
            <OsdsSelectOption value="other">
              {t('account-disable-2fa-create-form-legalform-other')}
            </OsdsSelectOption>
          </OsdsSelect>
        </div>
      )}

      {(!isOtherLegalFormForFR || legalForm) && (
        <>
          <FormDocumentFieldList
            control={control}
            legalForm={legalForm}
            subsidiary={subsidiary}
          />

          {isError && (
            <OsdsMessage className="mt-5" color={ODS_THEME_COLOR_INTENT.error}>
              {t('account-disable-2fa-create-form-error-message-send-document')}
            </OsdsMessage>
          )}
          <OsdsButton
            type={ODS_BUTTON_TYPE.submit}
            color={ODS_THEME_COLOR_INTENT.primary}
            className="mt-5"
            inline
            disabled={!(formState.isValid && isAnyFileSelected) || undefined}
          >
            {t('account-disable-2fa-create-form-submit')}
          </OsdsButton>
        </>
      )}

      {showConfirmModal && (
        <ConfirmModal
          title={t(
            'account-disable-2fa-create-form-confirm-modal-send-document-title',
          )}
          descriptionInsure={t(
            'account-disable-2fa-create-form-confirm-modal-send-document-description-insure',
          )}
          descriptionConfirm={t(
            'account-disable-2fa-create-form-confirm-modal-send-document-description-confirm',
          )}
          noButtonLabel={t('account-disable-2fa-confirm-modal-no')}
          yesButtonLabel={t('account-disable-2fa-confirm-modal-yes')}
          isPending={isPending}
          onClose={() => setShowConfirmModal(false)}
          onValidate={() => {
            mutate({ files });
          }}
        />
      )}
      {showSuccessModal && (
        <SuccessModal
          ovhHomePageHref={getWebSiteRedirectUrl()}
          title={t(
            'account-disable-2fa-create-form-success-modal-send-document-title',
          )}
          description={t(
            'account-disable-2fa-create-form-success-modal-send-document-description',
          )}
          ovhHomePageLabel={t('account-disable-2fa-success-modal-back-home')}
        />
      )}
    </form>
  );
};

export default FormCreateRequest;
