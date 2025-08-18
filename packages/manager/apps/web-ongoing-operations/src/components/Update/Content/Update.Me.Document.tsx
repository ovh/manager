import React from 'react';
import { TArgument } from '@/types';
import UploadedFile from '@/components/Upload/UploadedFile';

interface UpdateMeDocumentComponentProps {
  readonly argument: TArgument;
  readonly uploadedFiles: File[];
  readonly setUploadedFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

export default function UpdateMeDocumentComponent({
  argument,
  uploadedFiles,
  setUploadedFiles,
}: UpdateMeDocumentComponentProps) {
  return (
    <UploadedFile
      key={argument.key}
      argument={argument}
      uploadedFiles={uploadedFiles}
      setUploadedFiles={setUploadedFiles}
    />
  );
}
