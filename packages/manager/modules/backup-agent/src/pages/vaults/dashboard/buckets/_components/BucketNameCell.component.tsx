import { OdsText } from '@ovhcloud/ods-components/react';

import { DataGridTextCell } from '@ovh-ux/manager-react-components';

import { Bucket } from '@/types/Bucket.type';

export const BucketNameCell = ({ name }: Pick<Bucket, 'name'>) => {
  return (
    <DataGridTextCell>
      <OdsText>{name}</OdsText>
    </DataGridTextCell>
  );
};
