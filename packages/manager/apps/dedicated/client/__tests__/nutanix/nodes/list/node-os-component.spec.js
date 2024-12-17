import nutanixNodeOsComponent from '../../../../../../../modules/nutanix/src/dashboard/component/node-os-datagrid/module.js';

describe('nodeOsDatagrid component tests suite', () => {
  let $compile;
  let $rootScope;

  angular.module('ovhManagerCore', []);
  beforeEach(() => {
    angular.mock.module(
      'oui',
      'pascalprecht.translate',
      nutanixNodeOsComponent,
    );
  });

  beforeEach(() => {
    angular.mock.inject([
      '$compile',
      '$rootScope',
      (_$compile_, _$rootScope_) => {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
      },
    ]);
  });

  function addComponentBindings(binding, node) {
    Object.assign(binding, {
      node,
    });
  }

  it.each([
    {
      node: {
        isDeployed: false,
        isError: false,
        os: 'Nutanix OS',
      },
      expected: 'nutanix_node_status_not_installed',
    },
    {
      node: {
        isDeployed: true,
        isError: false,
        os: 'Nutanix OS',
      },
      expected: 'Nutanix OS',
    },
    {
      node: {
        isDeployed: false,
        isError: true,
        os: 'Nutanix OS',
      },
      expected: 'nutanix_node_status_error_installation',
    },
  ])(
    'should render the nodes state valid when isDeployed = $node.isDeployed and isError = $node.isError',
    ({ node, expected }) => {
      const $scope = $rootScope.$new();
      addComponentBindings($scope, node);

      const component = `
    <node-os-datagrid
        node="node"
    ></node-os-datagrid>
    `;
      const element = $compile(component)($scope);
      $scope.$digest();
      const html = element.html();

      expect(html).toContain(expected);
    },
  );
});
