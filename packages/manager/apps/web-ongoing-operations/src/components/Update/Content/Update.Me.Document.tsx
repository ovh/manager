import React from 'react';
import UploadedFile from '@/components/Upload/UploadedFile';
import { TArgument } from '@/types';

interface UpdateMeDocumentComponentProps {
  readonly argument: TArgument;
  readonly setUploadedFiles: React.Dispatch<
    React.SetStateAction<Record<string, File[]>>
  >;
}

export default function UpdateMeDocumentComponent({
  argument,
  setUploadedFiles,
}: UpdateMeDocumentComponentProps) {
  return (
    <UploadedFile
      key={argument.key}
      argument={argument}
      setUploadedFiles={setUploadedFiles}
    />
  );
}
