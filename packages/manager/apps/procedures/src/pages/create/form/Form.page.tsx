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
import { useUploadDocuments, useUploadLinks } from '@/data/hooks/useDocuments';
import { ConfirmModal } from './Modal/ConfirmModal';
import { SuccessModal } from './Modal/SuccessModal';
import { ovhHomePageHref } from './constants/form.constants';

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

  const files = flatFiles(watch());
  const isAnyFileSelected = files.length > 0;

  // We split the CTA action into two mutation, as once the first is done the API will start
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
          isPending={isPending}
          onClose={() => setShowConfirmModal(false)}
          onValidate={() => {
            // Bypassing the first mutation, if it is successful, we allow the user to
            // retry the upload process on his own
            if (links) {
              uploadDocuments({ files, links });
            } else {
              getUploadLinks(files.length);
            }
          }}
        />
      )}
      {showSuccessModal && <SuccessModal ovhHomePageHref={ovhHomePageHref} />}
    </form>
  );
};

export default FormCreateRequest;
