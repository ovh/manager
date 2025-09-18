import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FileUpload,
  FileUploadAcceptDetail,
  FileUploadItem,
  FileUploadList,
  FileUploadRejectDetail,
  ICON_NAME,
  Link,
  Message,
  MESSAGE_COLOR,
  MessageBody,
  MessageIcon,
  Text,
  TEXT_PRESET,
} from '@ovhcloud/ods-react';
import { TArgument } from '@/types';

interface FileUploadProps {
  readonly argument: TArgument;
  readonly setUploadedFiles: React.Dispatch<
    React.SetStateAction<Record<string, File[]>>
  >;
}

export default function UploadedFile({
  argument,
  setUploadedFiles,
}: FileUploadProps) {
  const { t } = useTranslation('dashboard');
  const [files, setFiles] = useState<File[]>([]);
  const [errorUpload, setErrorUpload] = useState<string>('');
  const { description, maximumSize, acceptedFormats, template } = argument;
  const fileUploadFormat = useMemo(
    () =>
      acceptedFormats.map((acceptedFormat) => `.${acceptedFormat}`).join(', '),
    [acceptedFormats],
  );
  const maxFile = 1;

  useEffect(() => {
    setUploadedFiles((prev) => ({
      ...prev,
      [argument.key]: files,
    }));
  }, [files, argument.key, setUploadedFiles]);

  return (
    <div>
      <div>
        <Text className="block font-bold mb-3" preset={TEXT_PRESET.span}>
          {description}
        </Text>
        {template && (
          <Message
            color={MESSAGE_COLOR.information}
            dismissible={false}
            className="mb-4"
          >
            <MessageIcon name={ICON_NAME.circleInfo} />
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
          setFiles(detail.files);
        }}
        onFileReject={(detail: FileUploadRejectDetail) => {
          setErrorUpload(detail.files[0].errors[0]);
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
        aria-required={true}
        triggerLabel={t('domain_operations_upload_file_label')}
      >
        <FileUploadList>
          {files.map((file: File, idx) => (
            <FileUploadItem file={file} key={`${file.name}-${idx}`} />
          ))}
        </FileUploadList>
      </FileUpload>
    </div>
  );
}
