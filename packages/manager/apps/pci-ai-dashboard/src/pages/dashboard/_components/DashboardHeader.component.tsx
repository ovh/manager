import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import NavLink from '@/components/links/NavLink.component';

export const DashboardHeader = () => {
  const { t } = useTranslation('pci-ai-dashboard');
  return (
    <div
      data-testid="service-header-container"
      className="flex flex-col gap-2 mt-4 mb-6"
    >
      <h2 data-testid="header-title">{t('title')}</h2>
      <p>{t('paragraphe1')}</p>
      <p>{t('paragraphe2')}</p>
      <NavLink to="https://www.ovhcloud.com/fr/public-cloud/prices/#ai-&-machine-learning">
        <div className="flex flex-row gap-1 items-center">
          {t('linkPrice')}
          <ArrowRight className="size-4" />
        </div>
      </NavLink>
    </div>
  );
};

DashboardHeader.Skeleton = function ServiceHeaderSkeleton() {
  const { t } = useTranslation('pci-ai-dashboard');
  return (
    <div
      data-testid="dashboard-header-skeleton"
      className="flex gap-2 items-center mt-4 mb-6"
    >
      <Skeleton className="rounded-full h-14 w-14" />
      <div>
        <h2>{t('title')}</h2>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-10" />
        </div>
      </div>
    </div>
  );
};
