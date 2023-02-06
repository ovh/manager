export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('iam', {
    url: '/iam',
    template: `
      <div class="iam">
          <span data-translate="iam_hello"></span>
      </div>
    `,
  });
};
