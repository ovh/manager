import { useEffect, useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

export type BreadcrumbItem = {
  id: string;
  label: string | undefined;
  href?: string;
};

export interface BreadcrumbProps {
  rootLabel?: string;
  appName?: string;
  projectId?: string;
  items?: BreadcrumbItem[];
}
export const useBreadcrumb = ({
  rootLabel,
  appName,
  items,
}: BreadcrumbProps) => {
  const { shell } = useContext(ShellContext);
  const [rootItems, setRootItems] = useState<BreadcrumbItem[]>([]);
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  useEffect(() => {
    const fetchRoot = async () => {
      try {
        const response = await shell?.navigation.getURL(appName, '#/', {});
        const rootItem = {
          id: rootLabel,
          label: rootLabel,
          href: String(response),
        };
        setRootItems([rootItem]);
      } catch {
        // Fetch navigation error
      }
    };
    fetchRoot();
  }, [rootLabel, appName, shell?.navigation]);

  const pathItems: BreadcrumbItem[] = pathnames.map((value) => {
    const item = items?.find(({ id }) => id === value);

    return {
      id: item?.id ?? value,
      label: item?.label ?? value,
      href: item?.href ?? `/#/${appName}/${value}`,
    };
  });

  return [...rootItems, ...pathItems];
};
