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
import {
  acceptFile,
  maxFileSize,
  maxFiles,
} from './formDocumentFieldValidation.constants';

type Props = {
  label: string;
  tooltips: string[];
  onChange?: FileInputEventHandler;
  multiple?: boolean;
  value?: FileWithError[];
};

export const FormDocumentFieldItem: FunctionComponent<Props> = ({
  value,
  onChange,
  multiple,
  tooltips,
  label,
}) => {
  return (
    <FileInputContainer
      accept={acceptFile}
      maxFiles={maxFiles}
      value={value}
      onChange={onChange}
      maxSize={maxFileSize}
      multiple={multiple}
    >
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
        className="block"
        size={ODS_TEXT_SIZE._500}
      >
        <li className="my-3 ml-6 list-disc">{label}</li>
      </OsdsText>
      <FileInputContainer.FileInput className="w-1/3" />
      <FileInputContainer.FileTooltip tooltips={tooltips} />
      <FileInputContainer.FileList className="w-5/5" />
    </FileInputContainer>
  );
};
