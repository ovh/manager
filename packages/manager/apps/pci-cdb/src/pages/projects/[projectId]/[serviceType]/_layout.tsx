import { Outlet, redirect } from 'react-router-dom';
import { database } from '@/models/database';

export interface ServiceTypeLayoutProps {
  params: {
    projectId: string;
    serviceType: string;
  };
  request: Request;
}

// force the serciveType to be either a value of the enum, or the default value of "all"
export const Loader = ({ params, request }: ServiceTypeLayoutProps) => {
  const { serviceType } = params;
  if (
    !Object.values(database.ServiceTypeEnum).includes(
      serviceType as database.ServiceTypeEnum,
    )
  ) {
    const path = request.url.replace(serviceType, database.ServiceTypeEnum.all);
    return redirect(path);
  }
  return null;
};

const ServiceTypeIdLayout = () => {
  return (
    <>
      <Outlet />
    </>
  );
};
export default ServiceTypeIdLayout;
