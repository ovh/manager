import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  OdsText,
  OdsLink,
  OdsFormField,
  OdsInput,
} from '@ovhcloud/ods-components/react';
import { TArgumentData } from '@/interface';

interface ModalContentComponentProps {
  content: TArgumentData[];
}

export default function ModalContentComponent({
  content,
}: ModalContentComponentProps) {
  const { t } = useTranslation('dashboard');

  return (
    <div className="my-4">
      {content?.map((c, index) => (
        <div key={index}>
          {/* Rajouter data pour l'api */}
          {c.data.type === '/me/contact' && (
            <div>
              <OdsText preset="span" className="mb-4">
                {c.data.description}
              </OdsText>
              <OdsLink
                href={`/manager/#/dedicated/contact/${c.data.value}/?fields[]=${c.data.fields[0]}`}
                color="primary"
                label={t(
                  `domain_operations_update_nicowner_click_${c.data.key}`,
                )}
                className="block"
                target="_blank"
                icon="external-link"
              />
            </div>
          )}

          {c.data.type === '/me/document' && (
            <OdsLink
              href="test"
              label={t(`domain_operations_update_nicowner_click_${c.data.key}`)}
              icon="external-link"
              target="_blank"
              className="mb-1 block"
            />
          )}

          {c.data.type === '/me' && (
            <OdsInput
              id={c.data.key}
              placeholder={c.data.value}
              value={c.data.value}
              name={c.data.key}
            ></OdsInput>
          )}

          {c.data.type === 'string' && (
            <OdsFormField className="p-0 m-0">
              <div className="ods-form-field__label">
                <label htmlFor={c.data.key}>{c.data.key}</label>
              </div>
              <OdsInput
                id={c.data.key}
                placeholder={c.data.value}
                value={c.data.value}
                name={c.data.key}
              ></OdsInput>
            </OdsFormField>
          )}
        </div>
      ))}
    </div>
  );
}
