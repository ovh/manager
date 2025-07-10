import { useTranslation } from 'react-i18next';
import {
  OdsDivider,
  OdsCard,
  OdsIcon,
  OdsButton,
} from '@ovhcloud/ods-components/react';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { Subtitle, DashboardTile } from '@ovh-ux/manager-react-components';
import { useParams, Link } from 'react-router-dom';

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

type OtherActionItem = {
  icon: keyof typeof ODS_ICON_NAME;
  label: string;
  link: string;
};

export default function Home() {
  const { t } = useTranslation(['home']);
  const { projectId } = useParams();

  const quickAccess: QuickAccessItem[] = [
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
  ];

  const otherActions: OtherActionItem[] = [
    {
      icon: 'book',
      label: t('create_ai_notebook'),
      link: `/public-cloud/pci/projects/${projectId}/ai-notebooks/new`,
    },
    {
      icon: 'network',
      label: t('create_load_balancer'),
      link: `/public-cloud/pci/projects/${projectId}/load-balancer/new`,
    },
    {
      icon: 'bill',
      label: t('billing'),
      link: `/public-cloud/pci/projects/${projectId}/billing`,
    },
    {
      icon: 'cog',
      label: t('quotas'),
      link: `/public-cloud/pci/projects/${projectId}/quotas`,
    },
  ];

  return (
    <>
      <Subtitle>{t('quick_access')}</Subtitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 my-6">
        {quickAccess.map((item, idx) => (
          <Link to={item.link} style={{ textDecoration: 'none' }} key={idx}>
            <OdsCard className="flex flex-row items-center p-4 h-full border border-[#D1D5DB] rounded-xl bg-white shadow-none min-h-[100px]">
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
          </Link>
        ))}
      </div>
      <div className="my-8">
        <div className="flex flex-wrap items-center gap-3 mt-4 sm:flex-nowrap">
          <Subtitle className="mr-4 whitespace-nowrap">{t('others')}</Subtitle>
          <div className="flex flex-wrap gap-3 flex-1">
            {otherActions.map((action, idx) => (
              <Link
                to={action.link}
                style={{ textDecoration: 'none' }}
                key={idx}
              >
                <OdsButton
                  variant="outline"
                  className="whitespace-nowrap flex items-center gap-2 px-4 py-2"
                  icon={ODS_ICON_NAME[action.icon]}
                  label={action.label}
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
      <OdsDivider className="my-8" />
      {/* add Dashboard Tile */}
    </>
  );
}
