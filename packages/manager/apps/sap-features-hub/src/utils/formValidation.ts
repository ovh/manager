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
