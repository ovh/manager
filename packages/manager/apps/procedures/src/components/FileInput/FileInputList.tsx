import React, { FunctionComponent, MouseEvent, useContext } from 'react';
import { useTranslation } from 'react-i18next';
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

  const { value, multiple, onChange, accept, maxSize, disabled } = context;

  const handleDeleteFile = (
    e: MouseEvent<HTMLOsdsIconElement, globalThis.MouseEvent>,
    file: File,
  ) => onChange?.({ files: value.filter((f) => f.name !== file.name), e });

  return value?.length ? (
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
          disabled={disabled}
        />
      ))}
    </div>
  ) : (
    <></>
  );
};
