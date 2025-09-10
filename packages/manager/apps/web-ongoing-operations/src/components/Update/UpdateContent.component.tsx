import React from 'react';
import { TArgument, UploadedArgumentFiles } from '@/types';
import UpdateMeContactComponent from '@/components/Update/Content/Update.Me.Contact.component';
import UpdateMeDocumentComponent from '@/components/Update/Content/Update.Me.Document';
import UpdateMeComponent from '@/components/Update/Content/Update.Me.component';
import UpdateStringComponent from '@/components/Update/Content/Update.String.component';

interface UpdateContentComponentProps {
  readonly domainName: string;
  readonly operationId: number;
  readonly argument: TArgument;
  readonly operationName: string;
  readonly onChange: (key: string, value: string) => void;
  readonly setUploadedFiles: React.Dispatch<
    React.SetStateAction<Record<string, File[]>>
  >;
}

export default function UpdateContentComponent({
  domainName,
  argument,
  operationName,
  setUploadedFiles,
  onChange,
}: UpdateContentComponentProps) {
  const { key, value, fields, type } = argument;
  return (
    <div>
      {type === '/me/contact' && (
        <UpdateMeContactComponent
          domainName={domainName}
          argumentKey={key}
          value={value}
          operationName={operationName}
          fields={fields}
        />
      )}

      {type === '/me/document' && (
        <UpdateMeDocumentComponent
          argument={argument}
          setUploadedFiles={setUploadedFiles}
        />
      )}

      {type === '/me' && (
        <UpdateMeComponent argumentKey={key} value={value} fields={fields} />
      )}

      {type === 'string' && (
        <UpdateStringComponent
          argumentKey={key}
          value={value}
          onChange={onChange}
        />
      )}
    </div>
  );
}
