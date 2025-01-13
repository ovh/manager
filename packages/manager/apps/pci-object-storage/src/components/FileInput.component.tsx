import { OdsFile } from '@ovhcloud/ods-components';
import { OdsFileUpload } from '@ovhcloud/ods-components/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type FileInputComponentProps = {
  dropzoneLabel: string;
  onFilesSelected: (files: File[]) => void;
};

export default function FileInputComponent({
  dropzoneLabel,
  onFilesSelected,
}: Readonly<FileInputComponentProps>) {
  const { t } = useTranslation('pci-common');

  const [selectedFiles, setSelectedFiles] = useState<OdsFile[]>([]);

  const handleFileChange = ({ detail }) => {
    const newFiles = Array.from(detail.files) as File[];

    const updatedFiles = [...selectedFiles, ...newFiles];
    setSelectedFiles(updatedFiles);
    onFilesSelected(updatedFiles);
  };

  const handleRemoveFile = ({ detail }) => {
    const updatedFiles = selectedFiles.filter(
      (file) => file.odsId !== detail.odsId,
    );
    setSelectedFiles(updatedFiles);
  };

  return (
    <OdsFileUpload
      className="w-full"
      dropzoneLabel={dropzoneLabel}
      browseFileLabel={t('common_file_filesSelector')}
      files={selectedFiles}
      onOdsChange={handleFileChange}
      onOdsCancel={handleRemoveFile}
    />
  );
}
