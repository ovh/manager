import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/ui/skeleton';
import NavLink from '@/components/links/NavLink.component';

export const DashboardHeader = () => {
  const { t } = useTranslation('pci-ai-dashboard');
  return (
    <div
      data-testid="service-header-container"
      className="flex gap-2 items-center mt-4 mb-6"
    >
      <div>
        <h2 data-testid="header-title">{t('title')}</h2>
        <div className="flex flex-wrap">
          <p>{t('paragraphe1')}</p>
          <p>{t('paragraphe2')}</p>
        </div>
        <div>
          <NavLink to="https://www.ovhcloud.com/fr/public-cloud/prices/#ai-&-machine-learning">
            {t('linkPrice')}
          </NavLink>
        </div>
      </div>
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
