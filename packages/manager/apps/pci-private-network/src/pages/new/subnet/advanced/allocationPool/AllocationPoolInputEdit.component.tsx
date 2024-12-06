import { FC, PropsWithChildren } from 'react';
import { useFormContext } from 'react-hook-form';
import IpRange from '@/components/ip-range/IpRange.component';
import { NewPrivateNetworkForm } from '@/types/private-network-form.type';

const AllocationPoolInputEdit: FC<PropsWithChildren<{ position: number }>> = ({
  children,
  position,
}) => {
  const {
    setValue,
    watch,
    formState: { touchedFields, errors },
  } = useFormContext<NewPrivateNetworkForm>();
  const allocationPools = watch('subnet.allocationPools');
  const startIp = allocationPools[position]?.start;
  const endIp = allocationPools[position]?.end;

  const isTouched = touchedFields.subnet?.allocationPools;
  const isErrors = errors.subnet?.allocationPools?.[position];
  const isStartIpHasError = isTouched && !!isErrors?.start;
  const isEndIpHasError = isTouched && !!isErrors?.end;

  const onIpChange = (key: string, value: string) => {
    if (value !== undefined && value !== null) {
      const updatedPools = [...allocationPools];

      updatedPools[position] = { ...updatedPools[position], [key]: value };

      setValue('subnet.allocationPools', updatedPools, {
        shouldTouch: true,
        shouldValidate: true,
      });
    }
  };

  const onStartIpChange = ({ target }) =>
    onIpChange('start', target.value as string);

  const onEndIpChange = ({ target }) => {
    onIpChange('end', target.value as string);
  };

  return (
    <IpRange
      start={startIp}
      end={endIp}
      isStartIpHasError={isStartIpHasError}
      isEndIpHasError={isEndIpHasError}
      onStartIpChange={onStartIpChange}
      onEndIpChange={onEndIpChange}
    >
      {children}
    </IpRange>
  );
};

export default AllocationPoolInputEdit;
