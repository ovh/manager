export default () => {
  let params = {};
  return {
    $get() {
      return {
        setParams(newParams) {
          params = newParams;
        },
        getParams() {
          return params;
        },
      };
    },
  };
};
