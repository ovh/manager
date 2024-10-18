import { FC } from 'react';
import { LoadingCell } from '@/components/datagrid/cell/LoadingCell.component';
import { BaseTextCell } from '@/components/datagrid/cell/TextCell.component';
import { TAddress } from '@/data/hooks/instance/useInstances';
import { DeepReadonly } from '@/types/utils.type';

export type TAddressesCellProps = DeepReadonly<{
  isLoading: boolean;
  addresses: TAddress[];
}>;
export const AddressesCell: FC<TAddressesCellProps> = ({
  isLoading,
  addresses,
}) => (
  <LoadingCell isLoading={isLoading}>
    {addresses.map((address) => (
      <BaseTextCell key={address.ip}>{address.ip}</BaseTextCell>
    ))}
  </LoadingCell>
);
