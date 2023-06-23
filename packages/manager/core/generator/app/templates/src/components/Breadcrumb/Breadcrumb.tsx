/**
 *  TODO - Move in the future
 *  Super components manager library
 */

import React, { useEffect, useState } from 'react';
import { Params, useMatches } from 'react-router-dom';

import { OsdsBreadcrumb } from '@ovhcloud/ods-stencil/components/react';
import { useLogger } from '@ovh-ux/manager-react-core-application';

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

function Breadcrumb(): JSX.Element {
  const matches = useMatches();
  const [crumbs, setCrumbs] = useState<BreadcrumbItem[]>([]);
  const logger = useLogger();

  useEffect(() => {
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
        setCrumbs(validCrumbs);
      })
      .catch((error) => {
        console.error('Error fetching breadcrumbs:', error);
      });
  }, [matches]);

  const rootName = `${window.location.origin}/#/{{appName}}`;
  const dato = crumbs.map((crumb, index) => ({
    label: crumb.label,
    href: `${rootName}${crumb.href}`,
  }));
  return crumbs?.length <= 1 ? <></> : <OsdsBreadcrumb items={dato} />;
}

export default Breadcrumb;
