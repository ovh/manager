export default () => ({
  restrict: 'A',
  scope: {
    change: '&tucInputFileChange',
  },
  link(tScope, tElement) {
    tElement.bind('change', () => {
      tScope.$apply(() => {
        const file = tElement.get(0).files[0];
        if (file) {
          tScope.change()(file);
        }
      });
    });
  },
});
