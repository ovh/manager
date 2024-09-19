import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { OsdsBreadcrumb } from '@ovhcloud/ods-components/react';
import { FC, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

type TBreadcrumbItem = {
  label: string;
  href?: string;
};

export type TBreadcrumbProps = {
  items?: TBreadcrumbItem[];
  projectLabel: string;
};

export const Breadcrumb: FC<TBreadcrumbProps> = ({
  items = [],
  projectLabel,
}) => {
  const { projectId } = useParams() as { projectId: string };
  const { navigation } = useContext(ShellContext).shell;
  const [projectUrl, setProjectUrl] = useState('');
  const { t } = useTranslation('common');

  useEffect(() => {
    navigation
      .getURL('public-cloud', `#/pci/projects/${projectId}`, {})
      .then((url: unknown) => setProjectUrl(url as string));
  }, [navigation, projectId]);

  return (
    <OsdsBreadcrumb
      items={[
        {
          href: projectUrl,
          label: projectLabel,
        },
        {
          href: `${projectUrl}/instances`,
          label: t('instances_title'),
        },
        ...items,
      ]}
    />
  );
};
