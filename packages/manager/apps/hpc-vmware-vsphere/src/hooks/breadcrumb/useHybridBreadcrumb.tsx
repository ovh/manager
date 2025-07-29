import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { HybridBreadcrumbItem } from './HybridBreadcrumbItem';
import { HybridBreadcrumbProps } from './HybridBreadcrumbProps';

export const useHybridBreadcrumb = ({
  appName,
  service,
  legacyAppBaseUrl,
  activePanel,
}: HybridBreadcrumbProps): HybridBreadcrumbItem[] => {
  const location = useLocation();

  const legacyAppServiceBaseUrl = `${legacyAppBaseUrl}/${service.name}`;

  const breadcrumbItems: HybridBreadcrumbItem[] = useMemo(() => {
    const activePanelSubPathName =
      activePanel === undefined
        ? ''
        : location.pathname.replace(activePanel.to, '');
    const activePanelSubRoutes = activePanelSubPathName
      .split('/')
      .filter((x) => x)
      .map((subPathName: string) => ({
        label: subPathName,
        ...(activePanel.isRedirectLegacy
          ? { href: `${activePanel.to}/${subPathName}` }
          : { to: `${activePanel.to}/${subPathName}` }),
      }));

    return [
      {
        label: appName,
        href: legacyAppBaseUrl,
      },
      {
        label: service.description,
        href: legacyAppServiceBaseUrl,
      },
      ...(activePanel
        ? [
            {
              label: activePanel.title,
              ...(activePanel.isRedirectLegacy
                ? { href: activePanel.to }
                : { to: activePanel.to }),
            },
            ...activePanelSubRoutes,
          ]
        : []),
    ];
  }, [activePanel, legacyAppServiceBaseUrl, location.pathname]);

  return breadcrumbItems;
};
