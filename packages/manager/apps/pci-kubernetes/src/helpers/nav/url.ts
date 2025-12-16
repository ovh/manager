import { resolvePath } from 'react-router-dom';

export const computeBreadcrumbUrl = <Entry extends object>(
  items: Array<Entry>,
  currentPath: string,
) => {
  return items.map((item, index) => {
    const backIndex = items.length - index - 1;
    const backs = Array.from({ length: backIndex }).fill('..').join('/');

    return {
      href: resolvePath(backs, currentPath).pathname,
      ...item,
    };
  });
};
