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
      return {
        pathname: match.pathname,
        crumb: await breadcrumb?.({ data, params }),
      };
    });

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 61b6ea55a2 (fix: sonar bugs and code smells)
    Promise.all(items)
      .then((breadcrumbs) => {
        setCrumbs(breadcrumbs.filter(({ crumb }) => !!crumb));
      })
<<<<<<< HEAD
<<<<<<< HEAD
      .catch((err) => console.error(err));
=======
    Promise.all(items).then((breadcrumbs) => {
      setCrumbs(breadcrumbs.filter(({ crumb }) => !!crumb));
    });
>>>>>>> 15132344e7 (fix(generator): delete breadcrumb package + do some fixes on the)
=======
      .catch((err) => logger.error(err));
>>>>>>> 61b6ea55a2 (fix: sonar bugs and code smells)
=======
      .catch((err) => console.error(err));
>>>>>>> 9fb2c8b03b (fix(generator.react): delete error use logger)
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
