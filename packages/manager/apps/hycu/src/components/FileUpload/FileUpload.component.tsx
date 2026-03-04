import { Icon, ICON_NAME } from '@ovhcloud/ods-react';
import {
  Button,
  Text,
  TEXT_PRESET,
  BUTTON_VARIANT,
  BUTTON_COLOR,
  BUTTON_SIZE,
} from '@ovh-ux/muk';
import React, { ChangeEvent, useRef, useState } from 'react';
import { Controller, UseControllerProps } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { LICENSE_FILE_EXT } from '@/constants';

const MAX_FILE_SIZE = 1e6; // 1 MB limit ~

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
    control.setError(name, undefined);
    if (file.size > MAX_FILE_SIZE) {
      setFileName('');
      control.setError(name, {
        message: t('hycu_dashboard_upload_file_too_big'),
      });
      return;
    }
    if (!file.name.endsWith(LICENSE_FILE_EXT)) {
      setFileName('');
      control.setError(name, {
        message: t('hycu_dashboard_upload_file_bad_type', {
          extension: LICENSE_FILE_EXT,
        }),
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).replace(
        'data:application/octet-stream;base64,',
        '',
      );
      onChange(base64String);
      setFileName(file.name);
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
            accept={LICENSE_FILE_EXT}
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
            <Icon name={ICON_NAME.file}></Icon>
            <Text preset={TEXT_PRESET.span}>
              {t('hycu_dashboard_drag_and_drop_attachment')}
            </Text>
            <Text preset={TEXT_PRESET.span}>
              {t('hycu_dashboard_accepted_formats', {
                extension: LICENSE_FILE_EXT,
              })}
            </Text>
            <Button
              variant={BUTTON_VARIANT.ghost}
              color={BUTTON_COLOR.primary}
              size={BUTTON_SIZE.sm}
              onClick={() => fileInputRef.current.click()}
            >
              <>
                <Icon name={ICON_NAME.upload}></Icon>
                {t('hycu_dashboard_browse')}
              </>
            </Button>
            <Text className="color-[--ods-theme-critical-color]">
              {error?.message}
            </Text>
            {fileName && (
              <Text className="flex gap-2 items-center">
                <Icon name={ICON_NAME.circleCheck}></Icon>
                {fileName}
              </Text>
            )}
          </div>
        </>
      )}
    />
  );
};
