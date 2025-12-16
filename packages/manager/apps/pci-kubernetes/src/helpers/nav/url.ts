import { resolvePath } from 'react-router-dom';

export const computeBreadcrumbUrl = <Crumb extends { label: string }>(
  items: Array<Crumb>,
  currentPath: string,
) => {
  return items.map((item, index) => {
    const backIndex = items.length - index - 1;
    const backs = Array.from({ length: backIndex }).fill('..').join('/');

    return {
      ...item,
      href: resolvePath(backs, currentPath).pathname,
    };
  });
};
