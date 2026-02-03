import React from 'react';

import { useTranslation } from 'react-i18next';

import { Text } from '@ovhcloud/ods-react';

const AclPage: React.FC = () => {
  const { t } = useTranslation('dashboard');

  return (
    <section className="pt-6">
      <Text preset="paragraph">{t('common.coming_soon')}</Text>
    </section>
  );
};

export default AclPage;
