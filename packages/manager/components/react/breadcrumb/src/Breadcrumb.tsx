import React, { useEffect, useState } from 'react';
import { Link, Params, useMatches } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react';

export type BreadcrumbHandleParams = {
  data: unknown;
  params: Params<string>;
};

type MatchHandle = {
  breadcrumb?: ({ data, params }: BreadcrumbHandleParams) => string;
};

type Match = {
  handle: MatchHandle;
  data: unknown;
  params: Params<string>;
};

export default function BreadcrumbComponent(): JSX.Element {
  const matches = useMatches();
  const [crumbs, setCrumbs] = useState<Record<string, string>[]>();

  useEffect(() => {
    const items = matches.map(async (match) => {
      const { handle, data, params }: Match = match;
      const breadcrumb = await handle?.breadcrumb;
      const crumb = {
        pathname: match.pathname,
        crumb: await breadcrumb?.({ data, params }),
      };
      return crumb;
    });

    Promise.all(items).then((breadcrumbs) => {
      setCrumbs(breadcrumbs.filter(({ crumb }) => !!crumb));
    });
  }, [matches]);

  // no need to display a breadcrumb for a single item
  if (!crumbs || crumbs.length <= 1) {
    return <></>;
  }

  return (
    <Breadcrumb>
      {crumbs.map(({ pathname, crumb }, index) => (
        <BreadcrumbItem key={pathname}>
          {index + 1 < crumbs.length ? (
            <BreadcrumbLink as={Link} to={pathname}>
              {crumb}
            </BreadcrumbLink>
          ) : (
            <span>{crumb}</span>
          )}
        </BreadcrumbItem>
      ))}
    </Breadcrumb>
  );
}
