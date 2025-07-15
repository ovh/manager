import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { OdsCard } from '@ovhcloud/ods-components/react';
import { Subtitle } from '@ovh-ux/manager-react-components';
import IconInstances from '@/assets/home/Instances.svg?url';
import IconKubernetes from '@/assets/home/Managed Kubernetes Service.svg?url';
import IconObjectStorage from '@/assets/home/Object Storage.svg?url';
import IconNetwork from '@/assets/home/vRack Private Network.svg?url';
import IconDatabase from '@/assets/home/Managed MongoDB.svg?url';
import IconBlockStorage from '@/assets/home/Block Storage.svg?url';

type QuickAccessItem = {
  icon: string;
  title: string;
  description: string;
  link: string;
};

export default function QuickAccess({ projectId }: { projectId: string }) {
  const { t } = useTranslation(['home']);
  const quickAccess: QuickAccessItem[] = useMemo(
    () => [
      {
        icon: IconInstances,
        title: t('instances'),
        description: t('create_instance'),
        link: `/public-cloud/pci/projects/${projectId}/instances/new`,
      },
      {
        icon: IconKubernetes,
        title: t('kubernetes'),
        description: t('create_cluster'),
        link: `/public-cloud/pci/projects/${projectId}/instances/new`,
      },
      {
        icon: IconObjectStorage,
        title: t('object_storage'),
        description: t('create_container'),
        link: `/public-cloud/pci/projects/${projectId}/instances/new`,
      },
      {
        icon: IconBlockStorage,
        title: t('block_storage'),
        description: t('create_volume'),
        link: `/public-cloud/pci/projects/${projectId}/instances/new`,
      },
      {
        icon: IconNetwork,
        title: t('network'),
        description: t('manage_vrack'),
        link: `/public-cloud/pci/projects/${projectId}/instances/new`,
      },
      {
        icon: IconDatabase,
        title: t('database'),
        description: t('create_database'),
        link: `/public-cloud/pci/projects/${projectId}/instances/new`,
      },
    ],
    [projectId, t],
  );

  return (
    <>
      <Subtitle>{t('quick_access')}</Subtitle>
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-5 my-6">
        {quickAccess.map((item, idx) => (
          <Link to={item.link} style={{ textDecoration: 'none' }} key={idx}>
            <OdsCard className="flex flex-row items-center p-4 h-full border border-[var(--ods-color-neutral-200)] rounded-xl bg-white shadow-none min-h-[100px]">
              <div className="bg-[var(--ods-color-information-700)] rounded flex items-center justify-center w-23 h-23">
                <img src={item.icon} alt="" className="w-20 h-20" />
              </div>
              <div className="flex flex-col justify-center ml-6">
                <div className="font-bold text-xl text-[var(--ods-color-heading)] mb-1 leading-tight">
                  {item.title}
                </div>
                <div className="flex justify-start items-center text-base text-[var(--ods-color-primary-500)] leading-tight">
                  {item.description}
                </div>
              </div>
            </OdsCard>
          </Link>
        ))}
      </div>
    </>
  );
}
