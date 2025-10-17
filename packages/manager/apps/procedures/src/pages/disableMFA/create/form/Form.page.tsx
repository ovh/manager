import React, { useState } from 'react';

import { FieldValues, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { ODS_THEME_COLOR_INTENT, ODS_THEME_TYPOGRAPHY_LEVEL } from '@ovhcloud/ods-common-theming';
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

import ExitGuard from '@/components/ExitGuard/ExitGuard.component';
import { ConfirmModal } from '@/components/modals/confirmModal/ConfirmModal.component';
import { SuccessModal } from '@/components/modals/successModal/SuccessModal.component';
import useUser from '@/context/User/useUser';
import { useProcedures } from '@/data/hooks/useProcedures';
import { LegalFrom } from '@/types/user.type';
import { getWebSiteRedirectUrl } from '@/utils/url-builder';

import { FormDocumentFieldList } from './FormDocumentFields/FormDocumentFieldList';

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

  const {
    user: { legalForm, subsidiary },
  } = useUser();
  const isOtherLegalFormForFR = legalForm === 'other' && subsidiary === 'FR';
  const [parsedLegalForm, setParsedLegalForm] = useState<LegalFrom>(
    isOtherLegalFormForFR ? null : legalForm,
  );
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const { useUploadDocuments, useUploadLinks } = useProcedures('2FA');

  const files = flatFiles(watch());
  const isAnyFileSelected = files.length > 0;

  // We split the CTA action into two mutations, as once the first one is done the API will start
  // to send us errors if we retry it
  // The following mutation cover the upload of the document as well as the finalization of the request
  const {
    mutate: uploadDocuments,
    isPending: isUploadPending,
    isError: hasUploadError,
    reset: resetUpload,
  } = useUploadDocuments({
    onSuccess: () => {
      setShowSuccessModal(true);
      setShowConfirmModal(false);
    },
    onError: () => {
      setShowConfirmModal(false);
    },
  });
  // The following mutation cover the request creation by posting the number of documents to be uploaded
  // for which the API will give us the upload links
  const {
    mutate: getUploadLinks,
    isPending: areUploadLinksPending,
    isError: hasUploadLinksError,
    data: links,
  } = useUploadLinks({
    onSuccess: (uploadLinks) => {
      uploadDocuments({ files, links: uploadLinks });
    },
    onError: () => {
      setShowConfirmModal(false);
    },
  });

  const isPending = areUploadLinksPending || isUploadPending;
  const isError = hasUploadLinksError || hasUploadError;

  const handleLegalFormChange = (e: OsdsSelectCustomEvent<OdsSelectValueChangeEventDetail>) => {
    setParsedLegalForm(() => {
      reset();
      resetUpload();
      return e.detail.value as LegalFrom;
    });
  };

  return (
    <form onSubmit={handleSubmit(() => setShowConfirmModal(true))}>
      {(isPending || isError) && <ExitGuard />}
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

      {(!isOtherLegalFormForFR || parsedLegalForm) && (
        <>
          <FormDocumentFieldList
            control={control}
            legalForm={parsedLegalForm}
            subsidiary={subsidiary}
            disabled={Boolean(links)}
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
          title={t('account-disable-2fa-create-form-confirm-modal-send-document-title')}
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
            // Bypassing the first mutation, if it is successful, we allow the user to
            // retry the upload process on his own
            if (links) {
              uploadDocuments({ files, links });
            } else {
              getUploadLinks({ numberOfDocuments: files.length });
            }
          }}
        />
      )}
      {showSuccessModal && (
        <SuccessModal
          ovhHomePageHref={getWebSiteRedirectUrl()}
          title={t('account-disable-2fa-create-form-success-modal-send-document-title')}
          description={t('account-disable-2fa-create-form-success-modal-send-document-description')}
          ovhHomePageLabel={t('account-disable-2fa-success-modal-back-home')}
        />
      )}
    </form>
  );
};

export default FormCreateRequest;
