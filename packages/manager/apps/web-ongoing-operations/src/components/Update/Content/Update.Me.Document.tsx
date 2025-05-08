import React from 'react';
import { OdsFile } from '@ovhcloud/ods-components';
import { TArgument } from '@/types';
import FileUpload from '@/components/Upload/FileUpload';

interface UpdateMeDocumentComponentProps {
  readonly argument: TArgument;
  readonly addFileUpload: (key: string, data: OdsFile[]) => void;
  readonly removeFileUpload: (key: string, fileName: string) => void;
}

export default function UpdateMeDocumentComponent({
  argument,
  addFileUpload,
  removeFileUpload,
}: UpdateMeDocumentComponentProps) {
  return (
    <FileUpload
      key={argument.key}
      argument={argument}
      addFileUpload={(files: OdsFile[]) => addFileUpload(argument.key, files)}
      removeFileUpload={(fileName: string) => {
        removeFileUpload(argument.key, fileName);
      }}
    />
  );
}
