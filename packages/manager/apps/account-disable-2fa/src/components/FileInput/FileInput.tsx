import React, { FunctionComponent, useContext, useRef } from 'react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_TYPE,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';
import { OsdsButton, OsdsIcon } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { FileInputContext } from './FileInputContainer';

type Props = {
  className?: string;
};

export const FileInput: FunctionComponent<Props> = ({ className }) => {
  const context = useContext(FileInputContext);
  if (!context) {
    throw Error(
      'The component <FileInput /> must be a child of FileInputContainer',
    );
  }
  const { onChange, id, multiple, accept, value, maxFiles } = context;

  const { t } = useTranslation('account-disable-2fa');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (!fileList) return;
    const newFiles: File[] = multiple
      ? [...value, ...Array.from(fileList)]
      : Array.from(fileList);

    onChange?.({ files: newFiles.slice(0, maxFiles), e: event });
    fileInputRef.current.value = '';
  };

  const disabled = value.length >= maxFiles;
  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        id={id}
        accept={accept}
        disabled={disabled}
        multiple={multiple}
        className="hidden"
        onChange={handleFileChange}
      />
      <OsdsButton
        color={ODS_THEME_COLOR_INTENT.primary}
        type={ODS_BUTTON_TYPE.button}
        size={ODS_BUTTON_SIZE.sm}
        className={className}
        disabled={disabled || undefined}
        onClick={() => fileInputRef.current.click()}
      >
        <span slot="start" className="mr-4">
          <OsdsIcon
            name={ODS_ICON_NAME.FOLDER}
            size={ODS_ICON_SIZE.xs}
            contrasted
          />
          <span>
            {multiple
              ? t('account-disable-2fa-file-input-select-files')
              : t('account-disable-2fa-file-input-select-file')}
          </span>
        </span>
      </OsdsButton>
    </>
  );
};
