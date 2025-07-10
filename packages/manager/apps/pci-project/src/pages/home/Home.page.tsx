import { useTranslation } from 'react-i18next';
import { OdsDivider, OdsCard } from '@ovhcloud/ods-components/react';
import { Subtitle } from '@ovh-ux/manager-react-components';

import IconInstances from '@/assets/home/Instances.svg?url';
import IconKubernetes from '@/assets/home/Managed Kubernetes Service.svg?url';
import IconObjectStorage from '@/assets/home/Object Storage.svg?url';
import IconNetwork from '@/assets/home/vRack Private Network.svg?url';
import IconDatabase from '@/assets/home/Managed MongoDB.svg?url';
import IconBlockStorage from '@/assets/home/Block Storage.svg?url';

export default function Home() {
  const { t } = useTranslation(['home']);

  // Quick access cards configuration
  const quickAccess = [
    {
      icon: IconInstances,
      title: t('instances'),
      description: t('create_instance'),
    },
    {
      icon: IconKubernetes,
      title: t('kubernetes'),
      description: t('create_cluster'),
    },
    {
      icon: IconObjectStorage,
      title: t('object_storage'),
      description: t('create_container'),
    },
    {
      icon: IconBlockStorage,
      title: t('block_storage'),
      description: t('create_volume'),
    },
    {
      icon: IconNetwork,
      title: t('network'),
      description: t('manage_vrack'),
    },
    {
      icon: IconDatabase,
      title: t('database'),
      description: t('create_database'),
    },
  ];

  return (
    <>
      <Subtitle>{t('quick_access')}</Subtitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 my-6">
        {quickAccess.map((item, idx) => (
          <OdsCard
            key={idx}
            className="flex flex-row items-center p-4 h-full border border-[#D1D5DB] rounded-xl bg-white shadow-none min-h-[100px]"
          >
            {/* Icon in a blue rounded square, left side */}
            <div className="bg-[#000E9C] rounded flex items-center justify-center w-23 h-23">
              <img src={item.icon} alt="" className="w-20 h-20" />
            </div>
            {/* Texts, right side */}
            <div className="flex flex-col justify-center ml-6">
              <div className="font-bold text-xl text-[var(--ods-single-color-heading)] mb-1 leading-tight">
                {item.title}
              </div>
              <div className="flex justify-start items-center text-base text-[#0050D7] leading-tight">
                {item.description}
              </div>
            </div>
          </OdsCard>
        ))}
      </div>
      <OdsDivider />
    </>
  );
}
