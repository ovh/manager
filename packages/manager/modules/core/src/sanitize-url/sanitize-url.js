export default /* @ngInject */ ($location, $transitions) => {
  // if url params contains unescaped '<' value then
  // reject transition to prevent html injection
  $transitions.onBefore({}, (transition) => {
    const invalidParams = [
      ...Object.values(transition.params()),
      ...Object.values($location.search()),
    ].some((param) => /[<|>]/.test(param));

    return !invalidParams;
  });
};
