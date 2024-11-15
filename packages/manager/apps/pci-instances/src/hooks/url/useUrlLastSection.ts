import { useMemo } from 'react';
import { useMatch, useResolvedPath } from 'react-router-dom';

export type TSectionType = 'delete' | 'start' | 'stop';

const sectionRegex = /^(delete|start|stop)$/;

export const useUrlLastSection = (): TSectionType | null => {
  const basePath = useResolvedPath('..');
  const match = useMatch<'section', string>(`${basePath.pathname}/:section`);

  return useMemo(() => {
    if (!match?.params.section || !sectionRegex.test(match.params.section))
      return null;
    return match.params.section as TSectionType;
  }, [match?.params.section]);
};
