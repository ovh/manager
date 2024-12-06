import { FC, useState, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_TEXT_COLOR_HUE,
  ODS_TEXT_COLOR_INTENT,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OsdsButton, OsdsIcon, OsdsText } from '@ovhcloud/ods-components/react';
import { NewPrivateNetworkForm } from '@/types/private-network-form.type';
import AllocationPoolInputEdit from './AllocationPoolInputEdit.component';
import { ALLOCATION_POOL_LIMIT } from './AllocationPool.constant';

const AllocationPool: FC = () => {
  const { t } = useTranslation('new');
  const [newPosition, setNewPosition] = useState<number>(0);
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<NewPrivateNetworkForm>();
  const allocationPools = watch('subnet.allocationPools');
  const isErrors = errors.subnet?.allocationPools?.[newPosition];
  const isStartIpHasError =
    !allocationPools?.[newPosition]?.start || !!isErrors?.start;
  const isEndIpHasError =
    !allocationPools?.[newPosition]?.end || !!isErrors?.end;

  const isAddUnAvailable =
    isStartIpHasError ||
    isEndIpHasError ||
    newPosition === ALLOCATION_POOL_LIMIT;

  const onAddNewAllocationIp = () => setNewPosition((position) => position + 1);

  const removeAllocationPool = (index: number) => {
    const updatedPools = allocationPools.filter((_, i) => index !== i);
    setValue('subnet.allocationPools', updatedPools);
    setNewPosition((position) => position - 1);
  };

  const editablePools = useMemo(
    () => Array.from({ length: newPosition }, (_, index) => index),
    [newPosition],
  );

  return (
    <>
      <OsdsText
        level={ODS_TEXT_LEVEL.body}
        color={ODS_TEXT_COLOR_INTENT.primary}
        hue={ODS_TEXT_COLOR_HUE._800}
        size={ODS_TEXT_SIZE._200}
      >
        {t('pci_projects_project_network_private_allocation_ip')}
      </OsdsText>
      {editablePools.map((item) => (
        <AllocationPoolInputEdit key={item} position={item}>
          <OsdsButton
            size={ODS_BUTTON_SIZE.sm}
            variant={ODS_BUTTON_VARIANT.ghost}
            color={ODS_THEME_COLOR_INTENT.primary}
            className="self-end"
            onClick={() => removeAllocationPool(item)}
          >
            <OsdsIcon
              name={ODS_ICON_NAME.TRASH}
              size={ODS_ICON_SIZE.xs}
              color={ODS_THEME_COLOR_INTENT.primary}
            />
          </OsdsButton>
        </AllocationPoolInputEdit>
      ))}
      <AllocationPoolInputEdit position={newPosition}>
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
      </AllocationPoolInputEdit>
    </>
  );
};

export default AllocationPool;
