import { useHref } from 'react-router-dom';

import { DataGridTextCell, Links } from '@ovh-ux/manager-react-components';

import { urlParams, urls } from '@/routes/Routes.constants';
import { Bucket } from '@/types/Bucket.type';

export const BucketNameCell = ({ id, name }: Pick<Bucket, 'id' | 'name'>) => {
  const bucketDashboardHref = useHref(urls.dashboardVaults.replace(urlParams.vaultId, id)); // TODO : Replace with good url

  return (
    <DataGridTextCell>
      <Links href={bucketDashboardHref} label={name} />
    </DataGridTextCell>
  );
};
