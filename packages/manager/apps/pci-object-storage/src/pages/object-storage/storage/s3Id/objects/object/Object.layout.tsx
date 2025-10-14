import { Outlet, useSearchParams } from 'react-router-dom';
import { useS3Data } from '../../S3.context';

function ObjectKey() {
  const [searchParams] = useSearchParams();
  const objectKey = searchParams.get('objectKey');
  return objectKey;
}

export function breadcrumb() {
  return <ObjectKey />;
}

export default function ObjectLayout() {
  const parentOutletData = useS3Data();
  return <Outlet context={parentOutletData} />;
}
