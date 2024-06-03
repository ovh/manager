import React, { FunctionComponent, MouseEvent } from 'react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components';
import { OsdsIcon } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';

type FileInputListItemProps = {
  file: File;
  deleteFile: (
    e: MouseEvent<HTMLOsdsIconElement, globalThis.MouseEvent>,
    file: File,
  ) => void;
  accept: string;
  maxSize: number;
};

export const FileInputListItem: FunctionComponent<FileInputListItemProps> = ({
  file,
  deleteFile,
  accept,
  maxSize,
}) => {
  const { t } = useTranslation('account-disable-2fa');

  const bytesToSize = (bytes: number): string => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(0)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const parseContentTypes = (inputString: string) => {
    const typesArray = inputString.split(',').map((type) => type.trim());
    const extensions = typesArray.map((type) => type.split('/')[1]);
    const lastType = extensions.pop();
    return { types: extensions.join(', '), lastType };
  };

  const errorMessages: string[] = [];
  if (!accept.includes(file.type)) {
    const { types, lastType } = parseContentTypes(accept);
    errorMessages.push(
      t('account-disable-2fa-file-input-type-file-error', {
        types,
        lastType,
      }),
    );
  }

  if (file.size > maxSize) {
    errorMessages.push(t('account-disable-2fa-file-input-size-file-error'));
  }

  const hasError = Boolean(errorMessages.length);

  return (
    <div
      className={`flex justify-between items-center border rounded p-4 mt-2 ${
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
      <p className="text-sm truncate">
        {file.name} {`(${bytesToSize(file.size)})`}
        {errorMessages.map((error, index) => (
          <p key={index}>{error}</p>
        ))}
      </p>

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
