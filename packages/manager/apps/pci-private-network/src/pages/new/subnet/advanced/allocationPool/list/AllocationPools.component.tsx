import { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';
import { OsdsButton, OsdsIcon } from '@ovhcloud/ods-components/react';
import IpRange from '@/components/ip-range/IpRange.component';
import { NewPrivateNetworkForm } from '@/types/private-network-form.type';

const AllocationPools: FC<{
  index: number;
}> = ({ index }) => {
  const {
    setValue,
    watch,
    formState: { errors, touchedFields },
  } = useFormContext<NewPrivateNetworkForm>();
  const allocationPools = watch('subnet.allocationPools') || [];

  const allocationIp = allocationPools?.[index];
  const isStartIpHasError =
    touchedFields.subnet?.allocationPools &&
    !!errors.subnet?.allocationPools?.[index]?.start;
  const isEndIpHasError =
    touchedFields.subnet?.allocationPools &&
    !!errors.subnet?.allocationPools?.[index]?.end;

  const updateAllocationPools = (field: 'start' | 'end', value: string) => {
    const updatedPools = allocationPools.map((pool, i) =>
      index === i ? { ...pool, [field]: value } : pool,
    );
    setValue('subnet.allocationPools', updatedPools, {
      shouldValidate: true,
      shouldTouch: true,
    });
  };

  const onStartIpChange = ({ target }) =>
    updateAllocationPools('start', target.value);

  const onEndIpChange = ({ target }) =>
    updateAllocationPools('end', target.value);

  const removeAllocationPool = () => {
    const updatedPools = allocationPools.filter((_, i) => index !== i);
    setValue('subnet.allocationPools', updatedPools);
  };

  return (
    <IpRange
      start={allocationIp?.start}
      end={allocationIp?.end}
      isStartIpHasError={isStartIpHasError}
      isEndIpHasError={isEndIpHasError}
      onStartIpChange={onStartIpChange}
      onEndIpChange={onEndIpChange}
    >
      <OsdsButton
        size={ODS_BUTTON_SIZE.sm}
        variant={ODS_BUTTON_VARIANT.ghost}
        color={ODS_THEME_COLOR_INTENT.primary}
        className="self-end"
        onClick={removeAllocationPool}
      >
        <OsdsIcon
          name={ODS_ICON_NAME.TRASH}
          size={ODS_ICON_SIZE.xs}
          color={ODS_THEME_COLOR_INTENT.primary}
        />
      </OsdsButton>
    </IpRange>
  );
};

export default AllocationPools;
