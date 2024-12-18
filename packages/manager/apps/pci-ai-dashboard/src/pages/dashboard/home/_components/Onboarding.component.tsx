import { ShieldPlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import ProductAdvantages from './ProductAdvantages.component';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function Onboarding() {
  const { t } = useTranslation('pci-ai-dashboard/home');
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
            iconeName={ODS_ICON_NAME.CLOUD_HAND_CONCEPT}
            title={t('reversibilityTitle')}
            description={t('reversibilityDescription')}
          />
          <ProductAdvantages
            iconeName={ODS_ICON_NAME.COMPONENT_CONCEPT}
            title={t('calculationTitle')}
            description={t('calculationDescription')}
          />
          <ProductAdvantages
            iconeName={ODS_ICON_NAME.CLOUD_PADLOCK_CONCEPT}
            title={t('securityTitle')}
            description={t('securityDescription')}
          />
          <ProductAdvantages
            iconeName={ODS_ICON_NAME.PAGE_CERTIFICATE_CONCEPT}
            title={t('conformityTitle')}
            description={t('conformityDescription')}
          />
          <ProductAdvantages
            iconeName={ODS_ICON_NAME.HAND_WORLD_CONCEPT}
            title={t('openSourceTitle')}
            description={t('openSourceDescription')}
          />
        </div>
      </CardContent>
    </Card>
  );
}
