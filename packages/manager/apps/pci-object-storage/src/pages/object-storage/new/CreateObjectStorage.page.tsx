import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';
import OrderFunnel from './_components/OrderFunnel.component';
import { useGetRegions } from '@/data/hooks/region/useGetRegions.hook';
import { useGetUsers } from '@/data/hooks/user/useGetUsers.hook';
import { useGetCatalog } from '@/data/hooks/catalog/useGetCatalog.hook';
import { useGetProductAvailability } from '@/data/hooks/availability/useGetProductAvailability.hook';
import OrderSkeleton from './_components/OrderSkeleton.component';
import Guides from '@/components/guides/Guides.component';

const breadcrumb = () => (
  <BreadcrumbItem
    translationKey={`breadcrumb`}
    namespace="pci-object-storage/order-funnel"
  />
);

const CreateObjectStorage = () => {
  const { t } = useTranslation('pci-object-storage/order-funnel');
  const { projectId } = useParams();
  const availabilityQuery = useGetProductAvailability(projectId);
  const pricingQuery = useGetCatalog();
  const regionsQuery = useGetRegions(projectId);
  const usersQuery = useGetUsers(projectId);

  if (
    regionsQuery.isPending ||
    !usersQuery.data ||
    availabilityQuery.isPending ||
    pricingQuery.isPending
  ) {
    return <OrderSkeleton />;
  }

  return (
    <>
      <div className="flex justify-between w-full items-center">
        <h2>{t('title')}</h2>
        <Guides selectors={['allGuides', 'gettingStarted']} />
      </div>
      <OrderFunnel
        regions={regionsQuery.data}
        users={usersQuery.data}
        availabilities={availabilityQuery.data}
        catalog={pricingQuery.data}
      />
      <p className="pt-2 text-sm text-muted-foreground">
        {t('s3LegalMentions')}
      </p>
    </>
  );
};

export { breadcrumb };
export default CreateObjectStorage;
