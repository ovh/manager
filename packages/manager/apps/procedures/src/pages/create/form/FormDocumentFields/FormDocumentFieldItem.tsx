import React, { FunctionComponent } from 'react';
import { OsdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
} from '@ovhcloud/ods-common-theming';
import { ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import {
  FileInputContainer,
  FileInputEventHandler,
  FileWithError,
} from '@/components/FileInput/FileInputContainer';

type Props = {
  label: string;
  tooltips: string[];
  onChange?: FileInputEventHandler;
  multiple?: boolean;
  value?: FileWithError[];
  accept: string;
  maxSize: number;
  maxFiles: number;
  id?: string;
  disabled: boolean;
};

export const FormDocumentFieldItem: FunctionComponent<Props> = ({
  value,
  onChange,
  multiple,
  tooltips,
  label,
  accept,
  maxFiles,
  maxSize,
  id,
  disabled,
}) => {
  return (
    <FileInputContainer
      id={id}
      accept={accept}
      maxFiles={maxFiles}
      value={value}
      onChange={onChange}
      maxSize={maxSize}
      multiple={multiple}
      disabled={disabled}
    >
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
        className="block"
        size={ODS_TEXT_SIZE._500}
      >
        <li className="my-3 ml-6 list-disc">{label}</li>
      </OsdsText>
      <FileInputContainer.FileInput />
      <FileInputContainer.FileTooltip tooltips={tooltips} />
      <FileInputContainer.FileList className="w-5/5" />
    </FileInputContainer>
  );
};
