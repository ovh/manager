import { Outlet } from 'react-router-dom';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';
import { useS3Data } from '../S3.context';

const breadcrumb = () => (
  <BreadcrumbItem translationKey="Objects" namespace="" />
);

const S3Objects = () => {
  const parentOutletData = useS3Data();
  return <Outlet context={parentOutletData} />;
};

export { breadcrumb };
export default S3Objects;
