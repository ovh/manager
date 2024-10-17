import React, { FunctionComponent, MouseEvent } from 'react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components';
import { OsdsIcon, OsdsText } from '@ovhcloud/ods-components/react';
import { FileWithError } from './FileInputContainer';

type FileInputListItemProps = {
  file: FileWithError;
  deleteFile: (
    e: MouseEvent<HTMLOsdsIconElement, globalThis.MouseEvent>,
    file: FileWithError,
  ) => void;
  accept: string;
  maxSize: number;
};

export const FileInputListItem: FunctionComponent<FileInputListItemProps> = ({
  file,
  deleteFile,
}) => {
  const bytesToSize = (bytes: number): string => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(0)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const hasError = Boolean(file.errors.length);

  return (
    <div
      className={`flex justify-between items-center border rounded p-4 mt-2 gap-4 ${
        hasError
          ? 'bg-red-100 border-red-600 text-red-800 '
          : 'bg-sky-100 border-sky-600 text-sky-800 '
      }`}
    >
      <OsdsIcon
        name={ODS_ICON_NAME.FILE}
        color={
          hasError
            ? ODS_THEME_COLOR_INTENT.error
            : ODS_THEME_COLOR_INTENT.primary
        }
        size={ODS_ICON_SIZE.sm}
      />
      <OsdsText
        className="text-sm"
        color={
          hasError
            ? ODS_THEME_COLOR_INTENT.error
            : ODS_THEME_COLOR_INTENT.primary
        }
      >
        {file.name} {`(${bytesToSize(file.size)})`}
        {file.errors.map((error, index) => (
          <span className="block" key={index}>
            {error}
          </span>
        ))}
      </OsdsText>

      <OsdsIcon
        name={ODS_ICON_NAME.CLOSE}
        color={
          hasError
            ? ODS_THEME_COLOR_INTENT.error
            : ODS_THEME_COLOR_INTENT.primary
        }
        className="ml-auto cursor-pointer"
        size={ODS_ICON_SIZE.sm}
        onClick={(e) => deleteFile(e, file)}
      />
    </div>
  );
};
