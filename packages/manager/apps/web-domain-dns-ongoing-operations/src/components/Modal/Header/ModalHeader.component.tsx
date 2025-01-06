import React from 'react';
import { OdsText } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';

interface ModalHeaderComponentProps {
  heading: string;
  description: string;
}

export default function ModalHeaderComponent({
  heading,
  description,
}: ModalHeaderComponentProps) {
  const { t } = useTranslation('dashboard');

  return (
    <hgroup>
      <OdsText preset="heading-3" className="mb-3">
        Données de l'opération sur {heading}
      </OdsText>
      {description && (
        <OdsText preset="span">
          {t('domain_operations_update_comment')} {description}
        </OdsText>
      )}
    </hgroup>
  );
}
