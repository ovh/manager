import { OdsInputChangeEvent } from '@ovhcloud/ods-components';

export const isValidInput = (e: OdsInputChangeEvent) =>
  e.detail.validity?.valid;

export const isValidUrl = (value: string) => {
  try {
    const url = new URL(value);
    if (!url) throw Error('Input is not a valid URL');
    return true;
  } catch (error) {
    return false;
  }
};

export const isValidDomain = (value: string) => {
  return /^(?=^.{4,253}$)((?!-)[A-Za-z0-9-]{1,63}(?<!-)\.)+[A-Za-z]{2,63}$/.test(
    value,
  );
};

export const isValidSapPassword = (password: string): boolean => {
  if (password?.length < 8) return false;
  if (!/[a-z]/.test(password)) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/\d/.test(password)) return false;
  if (!/[!" @$%&/()=?'*+~#\-.,;:{[\]}<>_|]/.test(password)) return false;
  if (!/^[A-Za-z\d!" @$%&/()=?'*+~#\-.,;:{[\]}<>_|]*$/.test(password)) {
    return false;
  }
  return true;
};
