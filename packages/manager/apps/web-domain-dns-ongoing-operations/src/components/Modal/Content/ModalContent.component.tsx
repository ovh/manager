import React from 'react';
import { OdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { TArgument } from '@/interface';
import MeContactComponent from './MeContact.component';
import MeDocumentComponent from './MeDocument.component';
import MeComponent from './Me.component';
import StringComponent from './String.component';

interface ModalContentComponentProps {
  domainId: string;
  data: TArgument;
  onChange: (key: string, value: string) => void;
}

export default function ModalContentComponent({
  domainId,
  data,
  onChange,
}: ModalContentComponentProps) {
  return (
    <div>
      <OdsText preset={ODS_TEXT_PRESET.paragraph} className="mb-2">
        {data.description}
      </OdsText>
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
