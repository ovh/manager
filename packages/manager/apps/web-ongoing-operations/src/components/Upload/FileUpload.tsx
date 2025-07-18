import {
  ODS_TEXT_PRESET,
  OdsFile,
  OdsFileChangeEventDetail,
  OdsFileRejectedEventDetail,
  OdsFileUploadCustomEvent,
  ODS_MESSAGE_COLOR,
  ODS_BUTTON_SIZE,
  ODS_BUTTON_COLOR,
} from '@ovhcloud/ods-components';
import {
  OdsFileUpload,
  OdsText,
  OdsMessage,
  OdsLink,
} from '@ovhcloud/ods-components/react';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TArgument } from '@/types';

interface FileUploadProps {
  readonly argument: TArgument;
  readonly addFileUpload: (file: OdsFile[]) => void;
  readonly removeFileUpload: (fileName: string) => void;
}

export default function FileUpload({
  argument,
  addFileUpload,
  removeFileUpload,
}: FileUploadProps) {
  const { t } = useTranslation('dashboard');
  const [uploadedFiles, setUploadedFiles] = useState<OdsFile[]>([]);
  const [errorUpload, setErrorUpload] = useState<string>('');
  const { description, maximumSize, acceptedFormats, template } = argument;
  const fileUploadFormat = useMemo(
    () =>
      acceptedFormats.map((acceptedFormat) => `.${acceptedFormat}`).join(', '),
    [acceptedFormats],
  );
  const maxFile = 1;

  return (
    <div>
      <div>
        <OdsText className="block mb-3" preset={ODS_TEXT_PRESET.span}>
          <strong>{description}</strong>
        </OdsText>
        {template && (
          <OdsMessage
            color={ODS_MESSAGE_COLOR.information}
            isDismissible={false}
            className="mb-4"
          >
            <OdsText className="block">
              {t('domain_operations_upload_file_template_1')}
              <OdsLink
                href={template}
                label={t('domain_operations_upload_file_template_link')}
                target="_blank"
                rel="noopener noreferrer"
              />
              {t('domain_operations_upload_file_template_2')}
            </OdsText>
          </OdsMessage>
        )}
      </div>

      <OdsFileUpload
        onOdsChange={(
          e: OdsFileUploadCustomEvent<OdsFileChangeEventDetail>,
        ) => {
          addFileUpload(e.detail.files);
          setUploadedFiles(e.detail.files);
        }}
        onOdsCancel={(e) => {
          setUploadedFiles([]);
          removeFileUpload(e.detail.name);
          setErrorUpload('');
        }}
        onOdsRejected={(
          e: OdsFileUploadCustomEvent<OdsFileRejectedEventDetail>,
        ) => setErrorUpload(e.detail.reason)}
        error={
          errorUpload && t(`domain_operations_upload_error_${errorUpload}`)
        }
        maxFile={maxFile}
        maxSize={maximumSize}
        maxSizeLabel={t('domain_operations_upload_max_size_label')}
        accept={fileUploadFormat}
        acceptedFileLabel={t('domain_operations_upload_accepted_file_types', {
          t0: fileUploadFormat,
        })}
        files={uploadedFiles}
        className="w-1/4"
        data-testid="upload"
        browseFileLabel={t('domain_operations_upload_file_label')}
        dropzoneLabel={t('domain_operations_upload_dropzone_label')}
      />
    </div>
  );
}
