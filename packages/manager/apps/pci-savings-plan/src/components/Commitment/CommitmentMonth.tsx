import { OdsText } from '@ovhcloud/ods-components/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

const CommitmentMonth = ({ duration }: { duration: number }) => {
  const { t } = useTranslation('create');

  return <OdsText>{t('commitment_month', { value: duration })}</OdsText>;
};

export default CommitmentMonth;
