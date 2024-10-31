import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
} from '@ovhcloud/ods-common-theming';
import { ODS_BUTTON_TYPE, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsMessage,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { GDPRFormValues } from '@/types/gdpr.type';
import { TextField } from './TextField/TextField.component';
import { SelectField } from './SelectField/SelectField.component';
import { TextAreaField } from './TextAreaField/TextAreaField.component';
import {
  EmailRegex,
  GDPRSubjectValues,
  MaxFileSize,
  OtherDocumentsMaxFiles,
  RGDPAcceptFile,
  TextInputRegex,
} from './RGDPForm.constants';
import './RGDPForm.style.css';
import { FileField } from './FileField/FileField.component';
import {
  useRGDPSendForm,
  useRGDPUploadDocuments,
} from '@/data/hooks/rgdp/useRGDP';
import { ConfirmModal } from '@/components/modals/confirmModal/ConfirmModal.component';
import { SuccessModal } from '@/components/modals/successModal/SuccessModal.component';
import { getWebSiteRedirectUrl } from '@/utils/url-builder';
import { FileWithError } from '@/components/FileInput/FileInputContainer';

const extractFiles = (formValue: GDPRFormValues): File[] =>
  formValue.otherDocuments.filter((file) => file);

export const RGDPForm: FunctionComponent = () => {
  const { t } = useTranslation('rgdp');
  const {
    handleSubmit,
    watch,
    control,
    formState: { isSubmitting, isValid, touchedFields },
    trigger,
  } = useForm<GDPRFormValues>({ mode: 'onBlur' });

  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  const {
    mutate: uploadDocuments,
    isPending: isPendingUpload,
    isError: isErrorUpload,
  } = useRGDPUploadDocuments({
    onSuccess: () => {
      setShowSuccessModal(true);
      setShowConfirmModal(false);
    },
    onError: () => {
      setShowConfirmModal(false);
    },
  });

  const {
    mutate: sendForm,
    isPending: isPendingSendForm,
    isError: isErrorSendForm,
  } = useRGDPSendForm({
    onSuccess: (links) => {
      const data = watch();
      const files = extractFiles(data);
      uploadDocuments({ fileLinks: links, files });
    },
    onError: () => {
      setShowConfirmModal(false);
    },
  });

  const isPending = isPendingUpload || isPendingSendForm;
  const isError = isErrorUpload || isErrorSendForm;

  const onSubmitForm = () => {
    const data = watch();
    const { email, category, description, nichandle, firstName, name } = data;
    sendForm({
      email,
      category,
      description,
      nichandle,
      firstName,
      name,
      numberOfDocuments: extractFiles(data).length,
    });
  };

  const email = watch('email');

  useEffect(() => {
    if (touchedFields.confirmEmail) {
      trigger('confirmEmail');
    }
  }, [email]);

  return (
    <form onSubmit={handleSubmit(() => setShowConfirmModal(true))} noValidate>
      <div className="my-10">
        <TextField
          label={t('rgdp_form_field_label_firstname')}
          name="firstName"
          required={t('rgdp_form_validation_message_required')}
          pattern={{
            value: TextInputRegex,
            message: t('rgdp_form_validation_message_invalid_format'),
          }}
          control={control}
        />

        <TextField
          label={t('rgdp_form_field_label_name')}
          name="name"
          required={t('rgdp_form_validation_message_required')}
          pattern={{
            value: TextInputRegex,
            message: t('rgdp_form_validation_message_invalid_format'),
          }}
          control={control}
        />

        <TextField
          label={t('rgdp_form_field_label_email')}
          helper={t('rgdp_form_field_helper_email')}
          name="email"
          required={t('rgdp_form_validation_message_required')}
          pattern={{
            value: EmailRegex,
            message: t('rgdp_form_validation_message_invalid_email_format'),
          }}
          control={control}
        />

        <TextField
          label={t('rgdp_form_field_label_confirm_email')}
          name="confirmEmail"
          validate={(value) =>
            value === email || t('rgdp_form_validation_message_email_match')
          }
          control={control}
        />

        <TextField
          label={`${t('rgdp_form_field_label_nichandle')} (${t(
            'rgdp_form_field_optional',
          )})`}
          name="nichandle"
          pattern={{
            value: TextInputRegex,
            message: t('rgdp_form_validation_message_invalid_format'),
          }}
          control={control}
        />

        <div className="flex flex-col md:flex-row gap-2 flex-wrap md:items-center mb-8">
          <OsdsText
            level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
            color={ODS_THEME_COLOR_INTENT.primary}
          >
            {t('rgdp_form_field_label_category')}
          </OsdsText>

          <SelectField
            name="category"
            required={t('rgdp_form_validation_message_required')}
            control={control}
            placeholder={t('rgdp_form_field_placeholder_category')}
            options={GDPRSubjectValues.map((value) => ({
              value,
              label: t(`rgdp_form_category_${value}`),
            }))}
          />

          <OsdsText
            level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
            color={ODS_THEME_COLOR_INTENT.primary}
          >
            {t('rgdp_form_field_label_category_detail')}
          </OsdsText>
        </div>

        <TextAreaField
          label={t('rgdp_form_field_label_request_description')}
          name="description"
          required={t('rgdp_form_validation_message_required')}
          control={control}
          pattern={{
            value: TextInputRegex,
            message: t('rgdp_form_validation_message_invalid_format'),
          }}
        />
      </div>
      <div>
        <div className="mb-6 flex flex-col">
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.info}
            level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
            className="block mb-6"
            size={ODS_TEXT_SIZE._500}
          >
            {`${t('rgdp_form_upload_documents_title')} (${t(
              'rgdp_form_field_optional',
            )})`}
          </OsdsText>

          <OsdsText
            color={ODS_THEME_COLOR_INTENT.text}
            size={ODS_TEXT_SIZE._500}
            level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          >
            {t('rgdp_form_upload_documents_notice')}
          </OsdsText>

          <OsdsText
            color={ODS_THEME_COLOR_INTENT.text}
            size={ODS_TEXT_SIZE._500}
            level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          >
            {t('rgdp_form_upload_documents_notice_readable_doc')}
          </OsdsText>

          <OsdsText
            color={ODS_THEME_COLOR_INTENT.text}
            size={ODS_TEXT_SIZE._500}
            level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
            className="font-bold mt-4"
          >
            {t('rgdp_form_upload_documents_notice_file_format')}
          </OsdsText>
        </div>

        <FileField
          label={t('rgdp_form_field_label_other_documents')}
          name="otherDocuments"
          control={control}
          accept={RGDPAcceptFile}
          maxFiles={OtherDocumentsMaxFiles}
          multiple
          maxSize={MaxFileSize}
          helper={t('rgdp_form_field_helper_other_documents', { maxFiles: 8 })}
        />
      </div>
      {isError && (
        <OsdsMessage className="mt-5" color={ODS_THEME_COLOR_INTENT.error}>
          {t('rgdp_form_error_message_submit')}
        </OsdsMessage>
      )}
      <OsdsButton
        type={ODS_BUTTON_TYPE.submit}
        color={ODS_THEME_COLOR_INTENT.primary}
        disabled={!isValid || isSubmitting || undefined}
        inline={true}
      >
        {t('rgdp_form_submit')}
      </OsdsButton>

      {showConfirmModal && (
        <ConfirmModal
          title={t('rgpd_confirm_modal_title')}
          descriptionInsure={t('rgpd_confirm_modal_description_insure')}
          descriptionConfirm={t('rgpd_confirm_modal_description_confirm')}
          noButtonLabel={t('rgpd_confirm_modal_no')}
          yesButtonLabel={t('rgpd_confirm_modal_yes')}
          isPending={isPending}
          onClose={() => setShowConfirmModal(false)}
          onValidate={onSubmitForm}
        />
      )}
      {showSuccessModal && (
        <SuccessModal
          ovhHomePageHref={getWebSiteRedirectUrl()}
          title={t('rgpd_confirm_success_modal_title')}
          description={t('rgpd_confirm_success_modal_description')}
          ovhHomePageLabel={t('rgpd_confirm_success_modal_back_home')}
        />
      )}
    </form>
  );
};
