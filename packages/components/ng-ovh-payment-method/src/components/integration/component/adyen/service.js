export default {
  constructPostParams: (state) => {
    // stringify the adyen component data
    const resultStr = JSON.stringify({
      ...state.data,
      origin: window.location.origin,
    });
    // base64 the adyen component data
    const formData = btoa(resultStr);
    return {
      formData,
    };
  },

  hasCallbackUrlParams: (callbackUrlParams) => {
    return callbackUrlParams.redirectResult !== undefined;
  },

  parseFormSessionId: (formSessionId) => {
    const decodeBase64String = atob(formSessionId);
    const decodeURIString = decodeURIComponent(
      decodeBase64String
        .split('')
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join(''),
    );

    return JSON.parse(decodeURIString);
  },
};
