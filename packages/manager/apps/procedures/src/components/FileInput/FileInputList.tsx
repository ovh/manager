import React, { FunctionComponent, MouseEvent, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { OsdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { FileInputContext } from './FileInputContainer';
import { FileInputListItem } from './FileInputListItem';

type Props = {
  className?: string;
};

export const FileInputList: FunctionComponent<Props> = ({ className }) => {
  const context = useContext(FileInputContext);
  if (!context) {
    throw Error(
      'The component <FileInputList /> must be a child of FileInputContainer',
    );
  }
  const { t } = useTranslation('account-disable-2fa');

  const { value, multiple, onChange, accept, maxSize } = context;

  const handleDeleteFile = (
    e: MouseEvent<HTMLOsdsIconElement, globalThis.MouseEvent>,
    file: File,
  ) => onChange?.({ files: value.filter((f) => f.name !== file.name), e });

  return value?.length ? (
    <div className={className}>
      {multiple && (
        <OsdsText
          className="font-semibold"
          size={ODS_THEME_TYPOGRAPHY_SIZE._100}
          level={ODS_THEME_TYPOGRAPHY_LEVEL.caption}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {t('account-disable-2fa-file-input-attachments')}
        </OsdsText>
      )}
      {value.map((file, index) => (
        <FileInputListItem
          key={index}
          accept={accept}
          maxSize={maxSize}
          file={file}
          deleteFile={handleDeleteFile}
        />
      ))}
    </div>
  ) : (
    <></>
  );
};
