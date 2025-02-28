import React from 'react';
import { TArgument } from '@/types';
import MeContactComponent from './MeContact.component';
import MeDocumentComponent from './MeDocument.component';
import MeComponent from './Me.component';
import StringComponent from './String.component';

interface ModalContentComponentProps {
  readonly domainId: number;
  readonly data: TArgument;
  readonly onChange: (key: string, value: string) => void;
}

export default function ModalContentComponent({
  domainId,
  data,
  onChange,
}: ModalContentComponentProps) {
  return (
    <div>
      {data.type === '/me/contact' && (
        <MeContactComponent
          argumentKey={data.key}
          value={data.value}
          fields={data.fields}
        />
      )}

      {data.type === '/me/document' && (
        <MeDocumentComponent argumentKey={data.key} taskID={domainId} />
      )}

      {data.type === '/me' && (
        <MeComponent
          argumentKey={data.key}
          value={data.value}
          fields={data.fields}
        />
      )}

      {data.type === 'string' && (
        <StringComponent
          argumentKey={data.key}
          value={data.value}
          onChange={onChange}
        />
      )}
    </div>
  );
}
