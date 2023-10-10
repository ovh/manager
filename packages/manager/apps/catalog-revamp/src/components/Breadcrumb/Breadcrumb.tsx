import React, { useEffect, useState } from 'react';
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
  breadcrumb?: ({ data, params }: BreadcrumbHandleParams) => Promise<string>;
};

type Match = {
  handle: MatchHandle;
  data: unknown;
  params: Params<string>;
};

function Breadcrumb(): JSX.Element {
  const matches = useMatches();
  const [categoryCrumbs, setCategoryCrumbs] = useState<BreadcrumbItem[]>([]);
  const [matchCrumbs, setMatchCrumbs] = useState<BreadcrumbItem[]>([]);

  useEffect(() => {
    const categoryItem = {
      label: 'Dashboard',
      href: 'hub',
    };
    setCategoryCrumbs(() => [categoryItem]);
  }, []);

  useEffect(() => {
    const items = matches.map(async (match) => {
      const { handle, data, params }: Match = match;
      const breadcrumb = await Promise.resolve(handle?.breadcrumb);
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

  const rootName = `${window.location.origin}/#/`;
  const crumbs = [...categoryCrumbs, ...matchCrumbs];
  const data = crumbs.map((crumb, index) => ({
    label: crumb.label,
    href: `${rootName}${crumb.href}`,
  }));
  return <OsdsBreadcrumb items={data} />;
}

export default Breadcrumb;
