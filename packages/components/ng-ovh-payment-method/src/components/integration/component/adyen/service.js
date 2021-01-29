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
    return (
      callbackUrlParams.MD !== undefined &&
      callbackUrlParams.PaRes !== undefined
    );
  },

  parseFormSessionId: (formSessionId) => {
    return JSON.parse(atob(formSessionId));
  },
};
