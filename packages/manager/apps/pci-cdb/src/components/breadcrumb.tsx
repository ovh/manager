import { Home } from 'lucide-react';
import { useState, useEffect, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Params, useLocation, useMatches } from 'react-router-dom';

interface BreadcrumbItem {
  path: string;
  name: string | ReactElement;
}

const Breadcrumb = () => {
  const { t } = useTranslation('breadcrumb');
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);
  const location = useLocation();
  const matches = useMatches() as {
    id: string;
    pathname: string;
    params: Params<string>;
    data: unknown;
    handle: {
      breadcrumb?: (
        params: Params<string>,
        data: unknown,
      ) => string | ReactElement;
    };
  }[];

  useEffect(() => {
    const breadcrumbArray = matches
      .filter((match) => Boolean(match.handle?.breadcrumb))
      .map((match) => {
        return {
          path: match.pathname.replace(/\/$/, ''),
          name: match.handle.breadcrumb!(match.params, match.data),
        };
      });
    setBreadcrumbs(breadcrumbArray);
  }, [location.pathname]);

  const currentUrl = location.pathname.replace(/\/$/, '');
  const getBreadcrumbElement = (breadcrumb: BreadcrumbItem) => {
    if (typeof breadcrumb.name === 'string') return t(breadcrumb.name);
    return breadcrumb.name;
  };
  return (
    <div>
      <nav>
        <ul className="flex space-x-1 items-center">
          {breadcrumbs.map((breadcrumb, index) => (
            <li key={index} className="flex space-x-1">
              {index > 0 && <span>/</span>}
              {currentUrl === breadcrumb.path ? (
                <span className="flex items-center gap-2 whitespace-nowrap">
                  {index === 0 && <Home className="w-4 h-4" />}{' '}
                  {getBreadcrumbElement(breadcrumb)}
                </span>
              ) : (
                <Link
                  to={breadcrumb.path}
                  className="text-blue-500 hover:underline flex items-center gap-2 whitespace-nowrap"
                >
                  {index === 0 && <Home className="w-4 h-4" />}{' '}
                  {getBreadcrumbElement(breadcrumb)}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Breadcrumb;
