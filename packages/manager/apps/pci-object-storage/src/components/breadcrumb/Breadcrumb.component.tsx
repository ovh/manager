import React, { useState } from 'react';
import {
  Params,
  useParams,
  useLocation,
  useMatches,
  UIMatch,
} from 'react-router-dom';
import { useNavigation } from '@ovh-ux/manager-react-shell-client';
import { Skeleton } from '@datatr-ux/uxlib';
import Link from '@/components/links/Link.component';
import A from '@/components/links/A.component';
import usePciProject from '@/data/hooks/project/usePciProject.hook';

export type BreadcrumbHandleParams = {
  data: unknown;
  params: Params<string>;
};
type BreadcrumbHandle = {
  breadcrumb?: (args: {
    params: Params<string>;
    data: unknown;
  }) => React.ReactElement | null;
};

function Breadcrumb(): JSX.Element {
  const { projectId } = useParams();
  const { data: project } = usePciProject();

  const location = useLocation();

  const navigation = useNavigation();
  const [baseUrl, setBaseUrl] = useState('');
  const matches: UIMatch<unknown, BreadcrumbHandle>[] = useMatches();
  const [breadcrumbData, setBreadcrumbData] = React.useState([]);

  React.useEffect(() => {
    const breadcrumbArray = matches
      .filter((match) => Boolean(match.handle?.breadcrumb))
      .map((match) => {
        return {
          path: match.pathname,
          label: match.handle.breadcrumb(match),
        };
      });
    setBreadcrumbData(breadcrumbArray);
  }, [location.pathname]);

  React.useEffect(() => {
    const updateNav = async () => {
      const url = await navigation.getURL('public-cloud', ``, {});
      if (typeof url === 'string') {
        setBaseUrl(url);
      }
    };
    updateNav();
  }, [navigation]);

  return (
    <>
      <A href={`${baseUrl}/pci/projects/${projectId}`}>
        {project?.description ?? (
          <Skeleton className="h-4 w-20 inline-block align-middle" />
        )}
      </A>
      {breadcrumbData.map((bc, index) => (
        <React.Fragment key={`${index}-${bc.path}`}>
          <span className="mx-2 text-primary-500 font-semibold">|</span>
          {index < breadcrumbData.length - 1 ? (
            <Link to={bc.path}>
              <span title={bc.path}>{bc.label}</span>
            </Link>
          ) : (
            <span className="text-primary-500 font-semibold opacity-50 outiline-none cursor-not-allowed no-underline hover:text-primary-700">
              {bc.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </>
  );
}

export default Breadcrumb;
