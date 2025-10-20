export const isLocationParamsDefined = (params: string[]) => {
  const allDefined = params.every((param) => param !== undefined);

  if (!allDefined) {
    // eslint-disable-next-line no-console
    console.warn('One or more url parameters are undefined');
  }

  return allDefined;
};
