import React from 'react';
import { OdsText } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';

interface ModalHeaderComponentProps {
  readonly heading: string;
  readonly description: string;
}

export default function ModalHeaderComponent({
  heading,
  description,
}: ModalHeaderComponentProps) {
  const { t } = useTranslation('dashboard');

  return (
    <hgroup>
      <OdsText preset="heading-3" className="mb-3">
        {t('domain_operations_modal_title', {
          t0: heading,
        })}
      </OdsText>
      {description && (
        <OdsText preset="span">
          {t('domain_operations_update_comment', {
            t0: description,
          })}
        </OdsText>
      )}
    </hgroup>
  );
}
