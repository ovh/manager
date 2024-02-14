import React, { useState } from 'react';
import {
  Params,
  useParams,
  useLocation,
  useMatches,
  Link,
} from 'react-router-dom';
import { useNavigation } from '@ovh-ux/manager-react-shell-client';
import usePciProject from '../../hooks/usePciProject';

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
      <a
        className="text-primary-500 font-semibold outiline-none cursor-pointer no-underline hover:text-primary-700 hover:underline"
        href={`${baseUrl}/pci/projects/${projectId}`}
      >
        {project?.description}
      </a>
      {breadcrumbData.map((bc, index) => (
        <React.Fragment key={`${index}-${bc.href}`}>
          <span className="mx-4 text-primary-500 font-semibold">|</span>
          {index < breadcrumbData.length - 1 ? (
            <Link
              className="text-primary-500 font-semibold outiline-none cursor-pointer no-underline hover:text-primary-700 hover:underline"
              to={bc.href}
            >
              {bc.label}
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
