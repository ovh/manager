import { resolvePath } from 'react-router-dom';

export const computeBreadcrumbUrl = <Entry extends object>(
  items: Array<Entry>,
  currentPath: string,
) => {
  const lastIndex = items.length - 1;
  return items.map((item, index) => {
    const backIndex = lastIndex - index;
    const backs = Array.from({ length: backIndex }).fill('..').join('/');

    return {
      href: resolvePath(backs, currentPath).pathname,
      ...item,
    };
  });
};

const PROJECT_URL_REGEX = /^(?<projectUrl>.+\/projects\/\w+)/;
export const getProjectUrl = () => {
  const url = window.top?.location.href ?? window.document.baseURI;
  const match = url.match(PROJECT_URL_REGEX);
  const projectUrl = match?.groups?.['projectUrl'];

  return projectUrl ?? null;
};
