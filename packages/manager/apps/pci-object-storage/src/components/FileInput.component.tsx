import { useBytes } from '@ovh-ux/manager-pci-common';
import { ODS_BUTTON_SIZE, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { OdsButton, OdsIcon, OdsText } from '@ovhcloud/ods-components/react';
import { ChangeEvent, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

type FileInputComponentProps = {
  onFilesSelected: (files: File[]) => void;
};

export default function FileInputComponent({
  onFilesSelected,
}: Readonly<FileInputComponentProps>) {
  const { t } = useTranslation('pci-common');

  const { formatBytes } = useBytes();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(event.target.files);

    const updatedFiles = [...selectedFiles, ...newFiles];
    setSelectedFiles(updatedFiles);
    onFilesSelected(updatedFiles);
  };

  const handleRemoveFile = (index: number) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
    onFilesSelected(updatedFiles);
  };

  const handleOpenFileDialog = () => {
    fileInputRef.current.click();
  };

  return (
    <div>
      <OdsButton
        label={t('common_file_filesSelector')}
        size={ODS_BUTTON_SIZE.sm}
        icon="folder"
        onClick={handleOpenFileDialog}
        class="w-fit"
      />

      <input
        type="file"
        multiple
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {selectedFiles.length > 0 && (
        <div className="mt-4">
          <OdsText preset="caption">
            {t('common_file_attachmentsHeading')}
          </OdsText>

          <div className="flex flex-col gap-3 my-4">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="flex w-full items-center justify-between bg-[--ods-color-information-100] border-color-[--ods-color-information-300] rounded"
              >
                <div className="flex gap-2 items-center">
                  <OdsIcon name="file" className="text-blue-600" />
                  <OdsText preset="caption">
                    {file.name} ({formatBytes(file.size)})
                  </OdsText>
                </div>
                <OdsButton
                  icon="xmark"
                  label=""
                  onClick={() => handleRemoveFile(index)}
                  variant={ODS_BUTTON_VARIANT.ghost}
                  size={ODS_BUTTON_SIZE.xs}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
