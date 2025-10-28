export const buildURLSearchParams = (searchParams: Record<string, string> = {}): string => {
  const truthyParams = Object.keys(searchParams).reduce(
    (p, c) => {
      if (searchParams[c]) {
        return { ...p, [c]: searchParams[c] };
      }
      return p;
    },
    {} as Record<string, string>,
  );

  if (!Object.keys(truthyParams).length) {
    return '';
  }

  return `?${new URLSearchParams(truthyParams).toString()}`;
};

export const buildURLWithSearchParams = ({
  baseURL,
  searchParams = {},
}: {
  baseURL: string;
  searchParams?: Record<string, string>;
}) => {
  return `${baseURL}${buildURLSearchParams(searchParams)}`;
};
