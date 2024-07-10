import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/ui/skeleton';
import NavLink from '@/components/links/NavLink.component';

export const DashboardHeader = () => {
  const { t } = useTranslation('regions');
  return (
    <div
      data-testid="service-header-container"
      className="flex gap-2 items-center mt-4 mb-6"
    >
      <div>
        <h2>AI Dashboard</h2>
        <div className="flex flex-wrap">
          <p>
            Artificial intelligence (AI) is often viewed as a technology
            reserved only for those who are experienced in the field. At
            OVHcloud, we believe in the incredible potential of this practice
            across all business sectors. We are therefore focused on providing
            tools that can address the challenges encountered by different
            organisations, including data processing, mining, training and model
            deployment. Our goal is to make Machine Learning easy to use for all
            user profiles.
          </p>
          <p>Discover our full AI Tools range!</p>
        </div>
        <div>
          <NavLink to="https://www.ovhcloud.com/fr/public-cloud/prices/#ai-&-machine-learning">
            View services prices
          </NavLink>
        </div>
      </div>
    </div>
  );
};

DashboardHeader.Skeleton = function ServiceHeaderSkeleton() {
  return (
    <div className="flex gap-2 items-center mt-4 mb-6">
      <Skeleton className="rounded-full h-14 w-14" />
      <div>
        <h2>AI Dashboard</h2>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-10" />
        </div>
      </div>
    </div>
  );
};
