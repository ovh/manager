import HidePreloader from '@ovh-ux/manager-pci-gateway-app/src/core/HidePreloader';
import { OsdsBreadcrumb, OsdsText } from '@ovhcloud/ods-components/react';
import {
  PciGuidesHeader,
  useProject,
  useProjectUrl,
} from '@ovhcloud/manager-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { useParams } from 'react-router-dom';

type TPageProps = {
  breadCrumbItems: {
    href: string;
    label: string;
  }[];
  guidesCategory?: string;
  title: string | JSX.Element;
  children: string | JSX.Element | JSX.Element[];
};

export const PageComponent = ({
  title,
  guidesCategory,
  children,
}: TPageProps) => {
  const { projectId } = useParams();
  const projectUrl = useProjectUrl('public-cloud');
  const { data: project } = useProject(projectId);

  return (
    <>
      <HidePreloader />
      <OsdsBreadcrumb
        items={[
          {
            href: projectUrl,
            label: project?.description,
          },
        ]}
      />
      <div className="header mb-6 mt-8">
        <div className="flex items-center justify-between">
          <OsdsText
            level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
            size={ODS_THEME_TYPOGRAPHY_SIZE._600}
            color={ODS_THEME_COLOR_INTENT.primary}
          >
            {title}
          </OsdsText>
          {guidesCategory && (
            <PciGuidesHeader category="instances"></PciGuidesHeader>
          )}
        </div>
      </div>
      <div>{children}</div>
    </>
  );
};
