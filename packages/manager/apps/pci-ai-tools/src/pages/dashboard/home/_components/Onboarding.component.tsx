import { ShieldPlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader } from '@datatr-ux/uxlib';
import ProductAdvantages from './ProductAdvantages.component';

export default function Onboarding() {
  const { t } = useTranslation('ai-tools/dashboard/home');
  return (
    <Card data-testid="onboarding-card">
      <CardHeader>
        <div className="flex flex-row items-center">
          <ShieldPlus className="size-4 inline mr-2" />
          <h4>{t('onboardingAdvantageTile')}</h4>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 content-end">
          <ProductAdvantages
            iconeName={'cloud-hand-concept'}
            title={t('reversibilityTitle')}
            description={t('reversibilityDescription')}
          />
          <ProductAdvantages
            iconeName={'component-concept'}
            title={t('calculationTitle')}
            description={t('calculationDescription')}
          />
          <ProductAdvantages
            iconeName={'cloud-padlock-concept'}
            title={t('securityTitle')}
            description={t('securityDescription')}
          />
          <ProductAdvantages
            iconeName={'page-certificate-concept'}
            title={t('conformityTitle')}
            description={t('conformityDescription')}
          />
          <ProductAdvantages
            iconeName={'hand-world-concept'}
            title={t('openSourceTitle')}
            description={t('openSourceDescription')}
          />
        </div>
      </CardContent>
    </Card>
  );
}
