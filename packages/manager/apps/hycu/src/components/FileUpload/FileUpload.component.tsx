import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_TYPE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { OsdsButton, OsdsIcon, OsdsText } from '@ovhcloud/ods-components/react';
import React, { ChangeEvent, useRef, useState } from 'react';
import { Controller, UseControllerProps } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

const MAX_FILE_SIZE = 10e3; // 1 MB limit ~

export const FileInputField = ({
  name,
  control,
  ...rest
}: UseControllerProps) => {
  const { t } = useTranslation('hycu/dashboard');
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragHover, setIsDragHover] = useState(false);

  const parseFile = async (file: File, onChange: (result: string) => void) => {
    onChange(undefined);
    if (file.size > MAX_FILE_SIZE) {
      setFileName('');
      control.setError(name, {
        message: t('hycu_dashboard_upload_valid_file'),
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = btoa(reader.result as string);
      onChange(base64String);
      setFileName(file.name);
      control.setError(name, undefined);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = async (
    event: ChangeEvent<HTMLInputElement>,
    onChange: (result: string) => void,
  ) => {
    const file = event.target.files[0];
    if (file) parseFile(file, onChange);
  };

  const handleDrop = async (
    event: React.DragEvent<HTMLDivElement>,
    onChange: (result: string) => void,
  ) => {
    setIsDragHover(false);
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.files[0])
      parseFile(event.dataTransfer.files[0], onChange);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    // eslint-disable-next-line no-param-reassign
    event.dataTransfer.dropEffect = 'copy';
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <Controller
      {...rest}
      name={name}
      control={control}
      rules={{ required: t('hycu_dashboard_upload_license_required') }}
      render={({ field: { onChange }, fieldState: { error } }) => (
        <>
          <input
            data-testid="license-file-input"
            ref={fileInputRef}
            type="file"
            accept=".dat"
            onChange={(e) => handleFileChange(e, onChange)}
            style={{ display: 'none' }}
          />
          <div
            className={`flex flex-col items-center w-full py-7 border-2 border-dashed rounded-md ${
              isDragHover ? 'bg-blue-50' : ''
            } ${!error?.message ? 'border-blue-300' : 'border-red-300'}`}
            onDragEnter={() => setIsDragHover(true)}
            onDragLeave={() => setIsDragHover(false)}
            onDragOver={(e) => handleDragOver(e)}
            onDrop={(e) => handleDrop(e, onChange)}
          >
            <OsdsIcon
              name={ODS_ICON_NAME.FILE}
              color={ODS_THEME_COLOR_INTENT.primary}
              size={ODS_ICON_SIZE.lg}
            ></OsdsIcon>
            <OsdsText
              size={ODS_THEME_TYPOGRAPHY_SIZE._400}
              color={ODS_THEME_COLOR_INTENT.text}
            >
              {t('hycu_dashboard_drag_and_drop_attachment')}
            </OsdsText>
            <OsdsText color={ODS_THEME_COLOR_INTENT.text}>
              {t('hycu_dashboard_accepted_formats')}
            </OsdsText>
            <OsdsButton
              type={ODS_BUTTON_TYPE.button}
              variant={ODS_BUTTON_VARIANT.ghost}
              color={ODS_THEME_COLOR_INTENT.primary}
              size={ODS_BUTTON_SIZE.sm}
              onClick={() => fileInputRef.current.click()}
              inline
            >
              <span slot="start">
                <OsdsIcon
                  size={ODS_ICON_SIZE.xxs}
                  color={ODS_THEME_COLOR_INTENT.success}
                  name={ODS_ICON_NAME.UPLOAD_CONCEPT}
                ></OsdsIcon>
              </span>
              {t('hycu_dashboard_browse')}
            </OsdsButton>
            <OsdsText color={ODS_THEME_COLOR_INTENT.error}>
              {error?.message}
            </OsdsText>
            {fileName && (
              <OsdsText
                className="flex gap-2 justify-center"
                color={ODS_THEME_COLOR_INTENT.success}
              >
                <OsdsIcon
                  size={ODS_ICON_SIZE.xxs}
                  color={ODS_THEME_COLOR_INTENT.success}
                  name={ODS_ICON_NAME.SUCCESS_CIRCLE}
                ></OsdsIcon>
                {fileName}
              </OsdsText>
            )}
          </div>
        </>
      )}
    />
  );
};
