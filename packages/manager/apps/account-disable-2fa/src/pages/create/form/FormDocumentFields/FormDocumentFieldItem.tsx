import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FileInputContainer,
  FileInputEventHandler,
  FileWithError,
} from '@/components/FileInput/FileInputContainer';

type Props = {
  fieldCode: string;
  tooltipCount: number;
  onChange?: FileInputEventHandler;
  multiple?: boolean;
  value?: FileWithError[];
};

export const FormDocumentFieldItem: FunctionComponent<Props> = ({
  value,
  onChange,
  multiple,
  fieldCode,
  tooltipCount,
}) => {
  const { t: tdoc } = useTranslation('account-disable-2fa-documents');

  const getTransletedTooltips = (code: string, count: number) =>
    Array.from({ length: count }, (_, index) =>
      tdoc(`tooltip-${index + 1}-${code}`),
    );
  const getTransletedFieldLabel = (code: string) => tdoc(`field-${code}`);

  return (
    <FileInputContainer
      accept={'image/jpeg,image/jpg,image/png,application/pdf'}
      maxFiles={10}
      value={value}
      onChange={onChange}
      maxSize={10 * 1024 * 1024}
      multiple={multiple}
    >
      <FileInputContainer.FileLabel className="block">
        <li className="my-3 ml-6 list-disc">
          {getTransletedFieldLabel(fieldCode)}
        </li>
      </FileInputContainer.FileLabel>
      <FileInputContainer.FileInput className="w-1/3" />
      <FileInputContainer.FileTooltip
        tooltips={getTransletedTooltips(fieldCode, tooltipCount)}
      />
      <FileInputContainer.FileList className="w-4/5" />
    </FileInputContainer>
  );
};
