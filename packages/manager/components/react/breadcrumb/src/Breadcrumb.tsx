/**
 *  TODO - Move in the future
 *  Super components manager library
 */

import React, { useEffect, useState } from 'react';
import { Link, Params, useMatches } from 'react-router-dom';

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
    <ul>
      {crumbs.map(({ pathname, crumb }, index) => (
        <li key={pathname}>
          {index + 1 < crumbs.length ? (
            <Link to={pathname}>{crumb}</Link>
          ) : (
            <span>{crumb}</span>
          )}
        </li>
      ))}
    </ul>
  );
}
