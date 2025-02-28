import Node from '../../../../../modules/nutanix/src/node.class';
import { SERVICE_STATES } from '../../../../../modules/nutanix/src/constants';

describe('Node class', () => {
  it.each([
    [
      'DEPLOY_FAILURE',
      SERVICE_STATES.ACTIVE,
      'Nutanix OS',
      {
        isTerminated: false,
        isError: true,
        isDeployed: false,
        isWaitForConfigure: true,
      },
    ],
    [
      'UNDEPLOY_FAILURE',
      SERVICE_STATES.ACTIVE,
      'Nutanix OS',
      {
        isTerminated: false,
        isError: true,
        isDeployed: false,
        isWaitForConfigure: true,
      },
    ],
    [
      'UNDEPLOY_CANCELLED',
      SERVICE_STATES.ACTIVE,
      'Nutanix OS',
      {
        isTerminated: false,
        isError: true,
        isDeployed: false,
        isWaitForConfigure: true,
      },
    ],
    [
      'DEPLOY_CANCELLED',
      SERVICE_STATES.ACTIVE,
      'Nutanix OS',
      {
        isTerminated: false,
        isError: true,
        isDeployed: false,
        isWaitForConfigure: true,
      },
    ],
    [
      'DEPLOYED',
      SERVICE_STATES.ACTIVE,
      'Nutanix OS',
      {
        isTerminated: false,
        isError: false,
        isDeployed: true,
        isWaitForConfigure: false,
      },
    ],
    [
      'DEPLOYED',
      SERVICE_STATES.ACTIVE,
      'none_64',
      {
        isTerminated: false,
        isError: false,
        isDeployed: false,
        isWaitForConfigure: true,
      },
    ],
    [
      'DEPLOYING',
      SERVICE_STATES.ACTIVE,
      'Nutanix OS',
      {
        isTerminated: false,
        isError: false,
        isDeployed: false,
        isWaitForConfigure: true,
      },
    ],
    [
      'UNDEPLOYED',
      SERVICE_STATES.ACTIVE,
      'Nutanix OS',
      {
        isTerminated: false,
        isError: false,
        isDeployed: false,
        isWaitForConfigure: true,
      },
    ],
    [
      'UNDEPLOYING',
      SERVICE_STATES.ACTIVE,
      'Nutanix OS',
      {
        isTerminated: false,
        isError: false,
        isDeployed: false,
        isWaitForConfigure: true,
      },
    ],
    [
      'UNKNOWN',
      SERVICE_STATES.ACTIVE,
      'Nutanix OS',
      {
        isTerminated: false,
        isError: false,
        isDeployed: false,
        isWaitForConfigure: true,
      },
    ],
    [
      'DEPLOYED',
      SERVICE_STATES.SUSPENDED,
      'Nutanix OS',
      {
        isTerminated: true,
        isError: false,
        isDeployed: true,
        isWaitForConfigure: false,
      },
    ],
  ])(
    'should correctly evaluate status %s with service status %s and os %s',
    (status, serviceStatus, os, expected) => {
      const node = new Node({
        ahvIp: '192.168.1.1',
        cvmIp: '192.168.1.2',
        server: 'server1',
        status,
        os,
        serviceStatus,
      });

      expect(node.isTerminated).toBe(expected.isTerminated);
      expect(node.isError).toBe(expected.isError);
      expect(node.isDeployed).toBe(expected.isDeployed);
      expect(node.isWaitForConfigure).toBe(expected.isWaitForConfigure);
    },
  );
});
