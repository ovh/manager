import React from 'react';
import { useTranslation } from 'react-i18next';
import { OdsText, OdsLink, OdsInput } from '@ovhcloud/ods-components/react';
import { useNavigate } from 'react-router-dom';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { TArgumentData } from '@/interface';

interface ModalContentComponentProps {
  content: TArgumentData[];
  domainId: string;
}

export default function ModalContentComponent({
  content,
  domainId,
}: ModalContentComponentProps) {
  const { t } = useTranslation('dashboard');
  const navigate = useNavigate();

  return (
    <div className="my-6 flex flex-col gap-y-4">
      {content?.map((c, index) => (
        <div key={index}>
          <OdsText preset={ODS_TEXT_PRESET.paragraph} className="mb-2">
            {c.data.description}
          </OdsText>
          {c.data.type === '/me/contact' && (
            <div>
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
              href=""
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
