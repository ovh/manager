import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FileUpload,
  FileUploadAcceptDetail,
  FileUploadItem,
  FileUploadList,
  Link,
  Message,
  MESSAGE_COLOR,
  MessageBody,
  Text,
  TEXT_PRESET,
} from '@ovhcloud/ods-react';
import { TArgument } from '@/types';

interface FileUploadProps {
  readonly argument: TArgument;
  readonly uploadedFiles: File[];
  readonly setUploadedFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

export default function UploadedFile({
  argument,
  uploadedFiles,
  setUploadedFiles,
}: FileUploadProps) {
  const { t } = useTranslation('dashboard');
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
        <Text className="block mb-3" preset={TEXT_PRESET.span}>
          <strong>{description}</strong>
        </Text>
        {template && (
          <Message
            color={MESSAGE_COLOR.information}
            dismissible={false}
            className="mb-4"
          >
            <MessageBody>
              <Text className="block">
                {t('domain_operations_upload_file_template_1')}
                <Link href={template} target="_blank" rel="noopener noreferrer">
                  {t('domain_operations_upload_file_template_link')}
                </Link>
                {t('domain_operations_upload_file_template_2')}
              </Text>
            </MessageBody>
          </Message>
        )}
      </div>
      <FileUpload
        onFileAccept={(detail: FileUploadAcceptDetail) => {
          setUploadedFiles(detail.files);
        }}
        accept={fileUploadFormat}
        acceptedFileLabel={t('domain_operations_upload_accepted_file_types', {
          t0: fileUploadFormat,
        })}
        error={
          errorUpload && t(`domain_operations_upload_error_${errorUpload}`)
        }
        maxFile={maxFile}
        maxSize={maximumSize}
        maxSizeLabel={t('domain_operations_upload_max_size_label')}
        dropzoneLabel={t('domain_operations_upload_dropzone_label')}
        required={true}
        data-testid="upload"
      >
        <FileUploadList>
          {uploadedFiles.map((file: File, idx) => (
            <FileUploadItem file={file} key={idx} />
          ))}
        </FileUploadList>
      </FileUpload>
    </div>
  );
}
