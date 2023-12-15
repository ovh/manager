/**
 *  TODO - Move in the future
 *  Super components manager library
 */

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

function Breadcrumb(): JSX.Element {
  const matches = useMatches();
  const [categoryCrumbs] = useState<BreadcrumbItem[]>([]);
  const [matchCrumbs, setMatchCrumbs] = useState<BreadcrumbItem[]>([]);

  useEffect(() => {
    const items = matches.map(async (match) => {
      const { handle, data, params }: any = match;
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

  const rootName = `${window.location.origin}/#/pci-rancher`;
  const crumbs = [...categoryCrumbs, ...matchCrumbs];
  const data = crumbs.map((crumb) => ({
    label: crumb.label,
    href: `${rootName}${crumb.href}`,
  }));
  return <OsdsBreadcrumb items={data} />;
}

export default Breadcrumb;
