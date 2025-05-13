import '../../../../../../../modules/nutanix/src/dashboard/nodes/list/module.js';
import { CLUSTER_RESPONSE_MOCK } from './cluster.mock';
import Cluster from '../../../../../../../modules/nutanix/src/cluster.class';
import Node from '../../../../../../../modules/nutanix/src/node.class';
import { NODE_RESPONSE_MOCK } from './node.mock';

describe('ovhManagerNutanixAllNodes component tests suite', () => {
  let $compile;
  let $rootScope;

  const mockCoreConfig = {
    getUser: jest.fn().mockReturnValue({ ovhSubsidiary: 'FR' }),
  };

  const mockNutanixNode = {
    getNodeDetails: jest
      .fn()
      .mockResolvedValue(CLUSTER_RESPONSE_MOCK.targetSpec.nodes[0]),
  };

  angular.module('ovhManagerCore', []);
  beforeEach(() => {
    angular.mock.module(
      'oui',
      'pascalprecht.translate',
      'ovhManagerNutanixAllNodes',
      ($provide) => {
        $provide.value('coreConfig', mockCoreConfig);
        $provide.value('NutanixNode', mockNutanixNode);
      },
    );
  });

  beforeEach(() => {
    angular.mock.inject([
      '$compile',
      '$rootScope',
      '$componentController',
      (_$compile_, _$rootScope_) => {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
      },
    ]);
  });

  function addComponentBindings(binding, { isNodeTerminated }) {
    const cluster = new Cluster(CLUSTER_RESPONSE_MOCK);
    const node = new Node({
      ...NODE_RESPONSE_MOCK,
      ...CLUSTER_RESPONSE_MOCK.targetSpec.nodes[0],
      ...(isNodeTerminated && { serviceStatus: 'suspended' }),
    });

    Object.assign(binding, {
      serviceName: 'serviceName',
      cluster,
      nodes: [node],
      powerOnNode: jest.fn(),
      goToAddNode: jest.fn(),
      powerOffNode: jest.fn(),
      installNode: jest.fn(),
      reinstallNode: jest.fn(),
      uninstallNode: jest.fn(),
      terminateNode: jest.fn(),
      handleSuccess: jest.fn(),
      handleError: jest.fn(),
    });
  }

  it('should render the list of nodes', () => {
    const $scope = $rootScope.$new();
    addComponentBindings($scope, { isNodeTerminated: false });

    const component = `
    <nutanix-all-nodes
        service-name="serviceName"
        cluster="cluster"
        nodes="nodes"
        power-on-node="powerOnNode"
        go-to-add-node="goToAddNode"
        power-off-node="powerOffNode"
        install-node="installNode"
        reinstall-node="reinstallNode"
        uninstall-node="uninstallNode"
        terminate-node="terminateNode"
        handle-success="handleSuccess"
        handle-error="handleError"
    ></nutanix-all-nodes>
    `;
    const element = $compile(component)($scope);
    $scope.$digest();
    const html = element.html();

    expect(html).toContain('<oui-datagrid ');
    expect(html).toContain('node-action-menu ');
    expect(html).not.toContain('node-action-menu-terminated ');
  });

  it('should render the list of nodes with terminated action', () => {
    const $scope = $rootScope.$new();
    addComponentBindings($scope, { isNodeTerminated: true });

    const component = `
    <nutanix-all-nodes
        service-name="serviceName"
        cluster="cluster"
        nodes="nodes"
        power-on-node="powerOnNode"
        go-to-add-node="goToAddNode"
        power-off-node="powerOffNode"
        install-node="installNode"
        reinstall-node="reinstallNode"
        uninstall-node="uninstallNode"
        terminate-node="terminateNode"
        handle-success="handleSuccess"
        handle-error="handleError"
    ></nutanix-all-nodes>
    `;
    const element = $compile(component)($scope);
    $scope.$digest();
    const html = element.html();

    expect(html).toContain('<oui-datagrid ');
    expect(html).not.toContain('node-action-menu ');
    expect(html).toContain('node-action-menu-terminated ');
  });
});
