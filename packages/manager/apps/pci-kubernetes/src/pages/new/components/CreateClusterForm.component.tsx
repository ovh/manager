import { useTranslation } from 'react-i18next';

import { Text } from '@ovhcloud/ods-react';

import { CreationCart } from './CreationCart.component';

export const CreateClusterForm = () => {
  const { t } = useTranslation('add');

  return (
    <div className="flex flex-col gap-6 md:flex-row">
      <section className="flex-[2]">
        <Text preset="heading-2">{t('kubernetes_add')}</Text>
      </section>
      <aside className="flex-1">
        <CreationCart />
      </aside>
    </div>
  );
};
