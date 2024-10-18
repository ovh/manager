import React, { FunctionComponent } from 'react';
import { Control, Controller, Validate, ValidationRule } from 'react-hook-form';
import { OsdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
} from '@ovhcloud/ods-common-theming';
import { ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import {
  FileInputContainer,
  FileWithError,
} from '@/components/FileInput/FileInputContainer';
import { GDPRFormValues } from '@/types/gdpr.type';

type Props = {
  name: keyof GDPRFormValues;
  label: string;
  control: Control<GDPRFormValues>;
  required?: string;
  helper?: string;
  accept?: string;
  maxFiles: number;
  maxSize: number;
  pattern?: ValidationRule<RegExp>;
  tooltips?: string[];
  multiple?: boolean;
  validate?:
    | Validate<string, GDPRFormValues>
    | Record<string, Validate<string, GDPRFormValues>>;
};

export const FileField: FunctionComponent<Props> = ({
  control,
  name,
  label,
  required,
  accept,
  maxFiles,
  maxSize,
  multiple,
  helper,
}) => {
  return (
    <div className="mb-8">
      <Controller
        name={name}
        control={control}
        rules={{
          required,
          validate: {
            custom: (files: FileWithError[]) => {
              if (!files) return true;
              return files.flatMap((itemFile) => itemFile.errors).length < 1;
            },
          },
        }}
        render={({ field: { onChange, value, name: _name } }) => (
          <FileInputContainer
            id={`field_id_${_name}`}
            accept={accept}
            maxFiles={maxFiles}
            value={value as FileWithError[]}
            onChange={(e) => onChange(e.files)}
            maxSize={maxSize}
            multiple={multiple}
          >
            <label className="block mb-2">
              <OsdsText
                level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
                color={ODS_THEME_COLOR_INTENT.primary}
              >
                {label}:{required && <sup>*</sup>}
              </OsdsText>
            </label>
            <FileInputContainer.FileInput />

            {helper && <OsdsText className="block">{helper}</OsdsText>}

            <FileInputContainer.FileList className="w-5/5" />
          </FileInputContainer>
        )}
      />
    </div>
  );
};
