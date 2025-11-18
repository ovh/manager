export const isLocationParamsDefined = (params: string[]) => {
  const allDefined = params.every((param) => param !== undefined);

  if (!allDefined) {
    console.warn('One or more url parameters are undefined');
  }

  return allDefined;
};
