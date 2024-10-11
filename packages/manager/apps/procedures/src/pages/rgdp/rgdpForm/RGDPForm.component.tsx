import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
} from '@ovhcloud/ods-common-theming';
import { ODS_BUTTON_TYPE, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { OsdsButton, OsdsText } from '@ovhcloud/ods-components/react';
import React, { FunctionComponent, useEffect } from 'react';
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

export const RGDPForm: FunctionComponent = () => {
  const { t } = useTranslation('rgdp');
  const {
    handleSubmit,
    watch,
    control,
    formState: { isSubmitting, isValid, touchedFields },
    trigger,
  } = useForm<GDPRFormValues>({ mode: 'onBlur' });

  const onSubmit = (data: GDPRFormValues) => {
    // TODO: Handle API call & ConfirmModal
    console.log(data);
  };

  const email = watch('email');

  useEffect(() => {
    if (touchedFields.confirmEmail) {
      trigger('confirmEmail');
    }
  }, [email]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
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
          label={t('rgdp_form_field_label_surname')}
          name="surname"
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
            message: t('rgdp_form_validation_message_invalid_format'),
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
          label={`${t('rgdp_form_field_label_nic')} (${t(
            'rgdp_form_field_optional',
          )})`}
          name="nicHandle"
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
            {t('rgdp_form_field_label_subject')}
          </OsdsText>

          <SelectField
            name="messageSubject"
            required={t('rgdp_form_validation_message_required')}
            control={control}
            placeholder={t('rgdp_form_field_placeholder_subject')}
            options={GDPRSubjectValues.map((value) => ({
              value,
              label: t(`rgdp_form_subject_${value}`),
            }))}
          />

          <OsdsText
            level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
            color={ODS_THEME_COLOR_INTENT.primary}
          >
            {t('rgdp_form_field_label_subject_detail')}
          </OsdsText>
        </div>

        <TextAreaField
          label={t('rgdp_form_field_label_request_description')}
          name="requestDescription"
          required={t('rgdp_form_validation_message_required')}
          control={control}
        />
      </div>
      <div>
        <div className="mb-6 flex flex-col gap-4">
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.info}
            level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
            className="block mb-6"
            size={ODS_TEXT_SIZE._500}
          >
            {t('rgdp_form_upload_documents_title')}
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
          >
            {t('rgdp_form_upload_documents_notice_no_valid_doc')}
          </OsdsText>

          <OsdsText
            color={ODS_THEME_COLOR_INTENT.text}
            size={ODS_TEXT_SIZE._500}
            level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
            className="font-bold"
          >
            {t('rgdp_form_upload_documents_notice_file_format')}
          </OsdsText>
        </div>

        <FileField
          label={t('rgdp_form_field_label_id_front')}
          name="idDocumentFront"
          control={control}
          accept={RGDPAcceptFile}
          maxFiles={1}
          maxSize={MaxFileSize}
          helper={t('rgdp_form_field_helper_id')}
        />

        <FileField
          label={t('rgdp_form_field_label_id_back')}
          name="idDocumentBack"
          control={control}
          accept={RGDPAcceptFile}
          maxFiles={1}
          maxSize={MaxFileSize}
          helper={t('rgdp_form_field_helper_id')}
        />

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
      <OsdsButton
        type={ODS_BUTTON_TYPE.submit}
        color={ODS_THEME_COLOR_INTENT.primary}
        disabled={!isValid || isSubmitting || undefined}
        inline={true}
      >
        {t('rgdp_form_submit')}
      </OsdsButton>
    </form>
  );
};
