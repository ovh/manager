import { useTranslation } from 'react-i18next';

import { TEXT_PRESET, Text } from '@ovhcloud/ods-react';

export default function TagsPage() {
  const { t } = useTranslation('shared');
  return (
    <section className="mt-4 flex flex-col">
      <Text preset={TEXT_PRESET.heading6}>{t('coming_soon')}...</Text>
    </section>
  );
}
