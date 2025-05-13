export const roundNumber = (value: number, decimals = 2) =>
  Number(Math.round(value * 10 ** decimals) / 10 ** decimals);

export const isValidEmail = (email: string) =>
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.exec(
    email?.toLowerCase() || '',
  ) !== null;
