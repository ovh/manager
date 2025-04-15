import React from 'react';
import MeContactComponent from './MeContact.component';
import MeDocumentComponent from './MeDocument.component';
import MeComponent from './Me.component';
import StringComponent from './String.component';
import { TArgument } from '@/types';

interface ModalContentComponentProps {
  readonly domainName: string;
  readonly operationId: number;
  readonly argument: TArgument;
  readonly operationName: string;
  readonly onChange: (key: string, value: string) => void;
}

export default function ModalContentComponent({
  domainName,
  operationId,
  argument,
  operationName,
  onChange,
}: ModalContentComponentProps) {
  const { key, value, fields, type } = argument;
  return (
    <div>
      {type === '/me/contact' && (
        <MeContactComponent
          domainName={domainName}
          argumentKey={key}
          value={value}
          operationName={operationName}
          fields={fields}
        />
      )}

      {type === '/me/document' && (
        <MeDocumentComponent argumentKey={key} operationID={operationId} />
      )}

      {type === '/me' && (
        <MeComponent argumentKey={key} value={value} fields={fields} />
      )}

      {type === 'string' && (
        <StringComponent argumentKey={key} value={value} onChange={onChange} />
      )}
    </div>
  );
}
