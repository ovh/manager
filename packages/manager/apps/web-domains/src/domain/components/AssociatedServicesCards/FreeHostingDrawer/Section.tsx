import { Text, TEXT_PRESET } from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

export default function Section({ title, children }: SectionProps) {
  const { t } = useTranslation(['domain']);

  return (
    <div className="space-y-8">
      <Text preset={TEXT_PRESET.heading3}>{t(title)}</Text>
      {children}
    </div>
  );
}
