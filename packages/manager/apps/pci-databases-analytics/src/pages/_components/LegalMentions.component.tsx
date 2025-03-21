import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@datatr-ux/uxlib';

const LegalMentions = () => {
  const { t } = useTranslation('pci-databases-analytics');
  return (
    <Card data-testid="legal-mentions-container">
      <CardContent className="pt-6">
        <p>{t('legal-general')}</p>
      </CardContent>
    </Card>
  );
};

export default LegalMentions;
