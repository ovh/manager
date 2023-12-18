import React from 'react';
import { Params, useMatches } from 'react-router-dom';
import { OsdsBreadcrumb } from '@ovhcloud/ods-components/breadcrumb/react';

export type BreadcrumbHandleParams = {
  data: unknown;
  params: Params<string>;
};

type BreadcrumbItem = {
  label: string;
  href: string;
};

type MatchHandle = {
  breadcrumb?: ({ data, params }: BreadcrumbHandleParams) => string;
};

type Match = {
  handle: MatchHandle;
  data: unknown;
  params: Params<string>;
};

export const Breadcrumb: React.FC = () => {
  const matches = useMatches();
  const [categoryCrumbs, setCategoryCrumbs] = React.useState<BreadcrumbItem[]>(
    [],
  );
  const [matchCrumbs, setMatchCrumbs] = React.useState<BreadcrumbItem[]>([]);

  React.useEffect(() => {
    const items = matches.map(async (match) => {
      const { handle, data, params }: Match = match;
      const breadcrumb = await handle?.breadcrumb;
      const crumb = {
        label: await breadcrumb?.({ data, params }),
        href: match.pathname,
      };
      return crumb;
    });

    Promise.all(items)
      .then((breadcrumbs) => {
        const validCrumbs = breadcrumbs.filter(
          ({ label, href }) => !!label && !!href,
        );
        setMatchCrumbs(validCrumbs);
      })
      .catch((error) => {
        console.error('Error fetching breadcrumbs:', error);
      });
  }, [matches]);

  const rootName = `${window.location.origin}/#`;
  const crumbs = [...categoryCrumbs, ...matchCrumbs];
  const data = crumbs.map((crumb) => ({
    label: crumb.label,
    href: `${rootName}${crumb.href}`,
  }));

  return (
    <div className="mb-5">
      <OsdsBreadcrumb items={data} />
    </div>
  );
};
