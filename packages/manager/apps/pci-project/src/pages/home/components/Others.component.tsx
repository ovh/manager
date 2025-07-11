import { OdsButton } from '@ovhcloud/ods-components/react';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { Link } from 'react-router-dom';
import { Subtitle } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';

type OtherActionItem = {
  icon: keyof typeof ODS_ICON_NAME;
  label: string;
  link: string;
};

export default function Others({ projectId }: { projectId: string }) {
  const { t } = useTranslation(['home']);
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
    <div className="my-8">
      <div className="flex flex-wrap items-center gap-3 mt-4 sm:flex-nowrap">
        <Subtitle className="mr-4 whitespace-nowrap">{t('others')}</Subtitle>
        <div className="flex flex-wrap gap-3 flex-1">
          {otherActions.map((action, idx) => (
            <Link to={action.link} style={{ textDecoration: 'none' }} key={idx}>
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
  );
}
