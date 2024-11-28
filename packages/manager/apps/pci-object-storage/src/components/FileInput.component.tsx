import { useBytes } from '@ovh-ux/manager-pci-common';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_SIZE,
  ODS_THEME_TYPOGRAPHY_LEVEL,
} from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { OsdsButton, OsdsIcon, OsdsText } from '@ovhcloud/ods-components/react';
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

  // Gérer la sélection des fichiers
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(event.target.files);

    const updatedFiles = [...selectedFiles, ...newFiles];
    setSelectedFiles(updatedFiles);
    onFilesSelected(updatedFiles); // Met à jour la liste des fichiers dans le parent
  };

  // Supprimer un fichier de la liste
  const handleRemoveFile = (index: number) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
    onFilesSelected(updatedFiles); // Met à jour la liste des fichiers dans le parent
  };

  // Ouvrir la boîte de dialogue de fichiers
  const handleOpenFileDialog = () => {
    fileInputRef.current.click();
  };

  return (
    <div>
      <OsdsButton
        size={ODS_BUTTON_SIZE.sm}
        onClick={handleOpenFileDialog}
        color={ODS_THEME_COLOR_INTENT.primary}
        class="w-fit"
      >
        <OsdsIcon
          name={ODS_ICON_NAME.FOLDER}
          size={ODS_ICON_SIZE.xxs}
          className="bg-white mr-6 align-middle"
        />
        {t('common_file_filesSelector')}
      </OsdsButton>

      <input
        type="file"
        multiple
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {selectedFiles.length > 0 && (
        <div className="mt-4">
          <OsdsText
            level={ODS_THEME_TYPOGRAPHY_LEVEL.caption}
            size={ODS_TEXT_SIZE._100}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {t('common_file_attachmentsHeading')}
          </OsdsText>
          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-[var(--ods-color-primary-075)] border-color-[var(--ods-color-primary-700)] p-2 pl-4 rounded mb-2"
            >
              <div>
                <OsdsIcon
                  name={ODS_ICON_NAME.FILE}
                  size={ODS_ICON_SIZE.xs}
                  color={ODS_THEME_COLOR_INTENT.primary}
                  className="mr-2 align-middle"
                />
                <OsdsText
                  color={ODS_THEME_COLOR_INTENT.text}
                  level={ODS_THEME_TYPOGRAPHY_LEVEL.caption}
                  size={ODS_TEXT_SIZE._100}
                >
                  {file.name} ({formatBytes(file.size)})
                </OsdsText>
              </div>
              <OsdsButton
                onClick={() => handleRemoveFile(index)}
                variant={ODS_BUTTON_VARIANT.ghost}
                size={ODS_BUTTON_SIZE.sm}
                className="text-red-600 hover:text-red-800"
              >
                <OsdsIcon
                  name={ODS_ICON_NAME.CLOSE}
                  size={ODS_ICON_SIZE.xxs}
                  color={ODS_THEME_COLOR_INTENT.primary}
                />
              </OsdsButton>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
