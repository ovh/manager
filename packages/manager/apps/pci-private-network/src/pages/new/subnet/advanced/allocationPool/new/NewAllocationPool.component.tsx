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
import { ALLOCATION_POOL_LIMIT } from './NewAllocationPool.constant';

const NewAllocationPool: FC<{ index: number }> = ({ index }) => {
  const {
    setValue,
    watch,
    formState: { touchedFields, errors },
  } = useFormContext<NewPrivateNetworkForm>();
  const allocationPools = watch('subnet.allocationPools');
  const startIp = allocationPools[index]?.start;
  const endIp = allocationPools[index]?.end;

  const isTouched = touchedFields.subnet?.allocationPools;
  const isErrors = errors.subnet?.allocationPools?.[index];
  const isStartIpHasError = isTouched && !!isErrors?.start;
  const isEndIpHasError = isTouched && !!isErrors?.end;

  const isAddUnAvailable =
    isStartIpHasError ||
    isEndIpHasError ||
    allocationPools.length === ALLOCATION_POOL_LIMIT;

  const onAddNewAllocationIp = () => {
    /* addToAllocationPools('subnet.allocationPools', [
        ...allocationPools,
        { start: startIp, end: endIp },
      ]) */
  };

  const onIpChange = (key: string, value: string) => {
    const updatedPools = [...allocationPools];

    updatedPools[index] = { ...updatedPools[index], [key]: value };

    setValue('subnet.allocationPools', updatedPools, {
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const onStartIpChange = ({ target }) =>
    onIpChange('start', target.value as string);

  const onEndIpChange = ({ target }) =>
    onIpChange('end', target.value as string);

  return (
    <IpRange
      start={startIp}
      end={endIp}
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
        disabled={isAddUnAvailable ? true : undefined}
        onClick={onAddNewAllocationIp}
      >
        <OsdsIcon
          name={ODS_ICON_NAME.ADD}
          size={ODS_ICON_SIZE.xs}
          color={ODS_THEME_COLOR_INTENT.primary}
        />
      </OsdsButton>
    </IpRange>
  );
};

export default NewAllocationPool;
