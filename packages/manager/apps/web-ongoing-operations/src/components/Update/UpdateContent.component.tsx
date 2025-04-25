import React from 'react';
import { OdsFile } from '@ovhcloud/ods-components';
import { TArgument } from '@/types';
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
  readonly addFileUpload: (key: string, data: OdsFile[]) => void;
  readonly removeFileUpload: (key: string, fileName: string) => void;
}

export default function UpdateContentComponent({
  domainName,
  argument,
  operationName,
  onChange,
  addFileUpload,
  removeFileUpload,
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
          addFileUpload={addFileUpload}
          removeFileUpload={removeFileUpload}
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
