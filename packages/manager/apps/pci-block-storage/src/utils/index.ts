export const capitalizeFirstLetter = (str: string | null | undefined) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : str;
