import BreadcrumbItem from "@/components/breadcrumb/BreadcrumbItem.component";
import { useTranslation } from "react-i18next";
import OrderFunnel from "./_components/OrderFunnel.component";
import { useGetRegions } from "@/data/hooks/region/useGetRegions.hook";
import { useParams } from "react-router-dom";
import { useGetUsers } from "@/data/hooks/user/useGetUsers.hook";
import { useGetUsersWithS3Credentials } from "@/data/hooks/user/useGetUsersWithS3Credentials.hook";
import { useGetCatalog } from "@/data/hooks/catalog/useGetCatalog.hook";
import { useGetProductAvailability } from "@/data/hooks/availability/useGetProductAvailability.hook";

export function breadcrumb() {
  return (
    <BreadcrumbItem
      translationKey={`breadcrumb`}
      namespace="pci-databases-analytics/services/new"
    />
  );
}

const Service = () => {
  const { t } = useTranslation('pci-databases-analytics/services/new');
  const { projectId } = useParams();
  const availabilityQuery = useGetProductAvailability(projectId)
  const pricingQuery = useGetCatalog();
  const regionsQuery = useGetRegions(projectId);
  const usersQuery = useGetUsers(projectId);
  const s3UserQueries = useGetUsersWithS3Credentials(
    projectId,
    usersQuery.data,
  );

  if (regionsQuery.isPending || !s3UserQueries.data || availabilityQuery.isPending || pricingQuery.isPending ) {
    return <div>{t('loading')}</div>;
  }

  return (
    <>
      <div className="flex justify-between w-full items-center">
          <h2>{t('title')}</h2>
      </div>
      <OrderFunnel regions={regionsQuery.data} users={s3UserQueries.data.filter(u => u.access_key)} availabilities={availabilityQuery.data} catalog={pricingQuery.data}/>
    </>
  );
};

export default Service;