import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  OdsText,
  OdsLink,
  OdsInput,
} from '@ovhcloud/ods-components/react';
import { useNavigate } from "react-router-dom";
import { TArgumentData } from '@/interface';

interface ModalContentComponentProps {
  content: TArgumentData[];
  domainId : number;
}

export default function ModalContentComponent({
  content,
  domainId
}: ModalContentComponentProps) {
  const { t } = useTranslation('dashboard');
  const navigate = useNavigate();

  return (
    <div className="my-6">
      {content?.map((c, index) => (
        <div key={index}>
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
              onClick={() => navigate(`/upload/${domainId}/${c.data.key}/`)}
              label={t(`domain_operations_update_nicowner_click_${c.data.key}`)}
              icon="external-link"
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
            <div className="mb-3">
              <div className="ods-form-field__label">
                <label htmlFor={c.data.key}>{c.data.key}</label>
              </div>
              <OdsInput
                id={c.data.key}
                placeholder={c.data.value}
                value={c.data.value}
                name={c.data.key}
              ></OdsInput>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
