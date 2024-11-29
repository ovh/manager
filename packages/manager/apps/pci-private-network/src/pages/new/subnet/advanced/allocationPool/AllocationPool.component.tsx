import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import {
  ODS_TEXT_COLOR_HUE,
  ODS_TEXT_COLOR_INTENT,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { NewPrivateNetworkForm } from '@/types/private-network-form.type';
import NewAllocationPool from './new/NewAllocationPool.component';
import AllocationPools from './list/AllocationPools.component';
import { AllocationPool as TAllocationPool } from '@/types/network.type';
import IpRange from '@/components/ip-range/IpRange.component';

const AllocationPool: FC = () => {
  const { t } = useTranslation('new');
  const { watch } = useFormContext<NewPrivateNetworkForm>();
  // const allocationPools = watch('subnet.allocationPools');

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
      {/* {allocationPools.map((_, index) => (
        <AllocationPools key={index} index={index} />
      ))} */}
      <NewAllocationPool index={0} />
    </>
  );
};

export default AllocationPool;
