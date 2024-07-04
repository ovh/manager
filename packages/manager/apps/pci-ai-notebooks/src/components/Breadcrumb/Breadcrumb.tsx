import React, { useState } from 'react';
import { Params, useParams, useLocation, useMatches } from 'react-router-dom';
import { useNavigation } from '@ovh-ux/manager-react-shell-client';
import usePciProject from '@/data/hooks/pciProjects.api.hooks';
import { Skeleton } from '../ui/skeleton';
import { Link, A } from '../links';

export type BreadcrumbHandleParams = {
  data: unknown;
  params: Params<string>;
};

export interface MatchWithBreadcrumb {
  id: string;
  pathname: string;
  params: Params<string>;
  data: unknown;
  handle: {
    breadcrumb?: (breadcrumbParams: {
      params: Params<string>;
      data: unknown;
    }) => React.ReactElement | null;
  };
}

function Breadcrumb(): JSX.Element {
  const { projectId } = useParams();
  const { data: project } = usePciProject();

  const location = useLocation();

  const navigation = useNavigation();
  const [baseUrl, setBaseUrl] = useState('');
  const matches = useMatches() as MatchWithBreadcrumb[];
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
      setBaseUrl(url as string);
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
