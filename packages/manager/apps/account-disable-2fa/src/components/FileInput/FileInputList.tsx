import React, { FunctionComponent, MouseEvent, useContext } from 'react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components';
import { OsdsIcon } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { FileInputContext } from './FileInputContainer';

type Props = {
  className?: string;
};

type FileInputListItemProps = {
  file: File;
  deleteFile: (
    e: MouseEvent<HTMLOsdsIconElement, globalThis.MouseEvent>,
    file: File,
  ) => void;
};

const FileInputListItem: FunctionComponent<FileInputListItemProps> = ({
  file,
  deleteFile,
}) => {
  const bytesToSize = (bytes: number): string => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(0)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="flex justify-between items-center border border-sky-600 rounded p-2 mt-2 bg-sky-100">
      <OsdsIcon
        name={ODS_ICON_NAME.FILE}
        color={ODS_THEME_COLOR_INTENT.primary}
        size={ODS_ICON_SIZE.xs}
      />
      <p className="text-sky-800 text-sm truncate">
        {file.name} {`(${bytesToSize(file.size)})`}
      </p>
      <OsdsIcon
        name={ODS_ICON_NAME.CLOSE}
        color={ODS_THEME_COLOR_INTENT.primary}
        className="ml-auto cursor-pointer"
        size={ODS_ICON_SIZE.xs}
        onClick={(e) => deleteFile(e, file)}
      />
    </div>
  );
};

export const FileInputList: FunctionComponent<Props> = ({ className }) => {
  const context = useContext(FileInputContext);
  if (!context) {
    throw Error(
      'The component <FileInputList /> must be a child of FileInputContainer',
    );
  }
  const { t } = useTranslation('account-disable-2fa');

  const { value, multiple, onChange } = context;

  const handleDeleteFile = (
    e: MouseEvent<HTMLOsdsIconElement, globalThis.MouseEvent>,
    file: File,
  ) => {
    if (onChange) {
      onChange({ files: value.filter((f) => f.name !== file.name), e });
    }
  };

  if (value.length) {
    return (
      <div className={className}>
        {multiple && (
          <label className="text-sky-900 text-xs font-semibold">
            {t('account-disable-2fa-file-input-attachments')}
          </label>
        )}
        {value.map((file, index) => (
          <FileInputListItem
            key={index}
            file={file}
            deleteFile={handleDeleteFile}
          />
        ))}
      </div>
    );
  }
  return <></>;
};
