import { PaymentAction } from '@adyen/adyen-web/dist/types/types';

export const convertToBase64 = (stringToConvert: string): string => {
  return btoa(
    encodeURIComponent(stringToConvert).replace(
      /%([0-9A-F]{2})/g,
      (_match, p1) => String.fromCharCode(parseInt(`0x${p1}`, 16)),
    ),
  );
};

export const constructPostParams = (state: {
  data: Record<string, unknown>;
}): { formData: string } => {
  // stringify the adyen component data
  const resultStr = JSON.stringify({
    ...state.data,
    origin: window.location.origin,
  });
  // base64 the adyen component data
  const formData = convertToBase64(resultStr);

  return {
    formData,
  };
};

export const parseFormSessionId = (
  formSessionId: string,
): { action?: PaymentAction; resultCode?: string; refusalReason?: string } => {
  const decodeBase64String = atob(formSessionId);
  const decodeURIString = decodeURIComponent(
    decodeBase64String
      .split('')
      .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join(''),
  );

  return JSON.parse(decodeURIString);
};
