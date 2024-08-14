import { Given } from '@cucumber/cucumber';
import { OrderStatus } from '@ovh-ux/manager-module-order';
import { ICustomWorld } from '@playwright-helpers';
import { getUrl } from '../utils';
import { ConfigParams } from '../../mocks/handlers';
import { ProductStatus, ResourceStatus } from '@/data';
import vrackServicesList from '../../mocks/vrack-services/get-vrack-services.json';

Given('User has {word} vRack Services', function(
  this: ICustomWorld<ConfigParams>,
  nbVsStr: string,
) {
  this.handlersConfig.nbVs = Number(nbVsStr);
});

Given('User wants to create a vRack Services with region {word}', function(
  this: ICustomWorld<ConfigParams>,
  region: string,
) {
  this.testContext.data.selectedRegion = region;
  this.testContext.initialUrl = getUrl('createVrackServices');
});

Given('User has a vRack Services order delivering', function(
  this: ICustomWorld<ConfigParams>,
) {
  this.handlersConfig.deliveringVrackServicesOrders = true;
});

Given('User has a vRack Services in {word} state', function(
  this: ICustomWorld<ConfigParams>,
  productStatus: ProductStatus,
) {
  const vsIndex = vrackServicesList.findIndex(
    (v) => v.currentState.productStatus === productStatus,
  );
  this.testContext.data.vsIndex = vsIndex;
  this.testContext.data.selectedVrackServices = vrackServicesList[vsIndex];
});

Given('User has a vRack Services with a status {word}', function(
  this: ICustomWorld<ConfigParams>,
  resourceStatus: ResourceStatus,
) {
  const vsIndex = vrackServicesList.findIndex(
    (v) => v.resourceStatus === resourceStatus,
  );

  this.testContext.data.vsIndex = vsIndex;
  this.testContext.data.selectedVrackServices = vrackServicesList[vsIndex];
});

Given(
  'User has {word} eligible vRacks to be associated to his vRack Services',
  function(this: ICustomWorld<ConfigParams>, anyEligibleVrack: 'an' | 'no') {
    this.handlersConfig.nbEligibleVrackServices =
      anyEligibleVrack === 'an' ? 5 : 0;
  },
);

Given('User has a vRack order {word}', function(
  this: ICustomWorld<ConfigParams>,
  orderStatus: OrderStatus,
) {
  this.handlersConfig.deliveringVrackOrders = orderStatus === 'delivering';
});

Given('User {string} a vRack Services associated to a vRack', function(
  this: ICustomWorld<ConfigParams>,
  hasVrack: 'has' | "doesn't have",
) {
  const vsIndex = vrackServicesList.findIndex(
    (v) =>
      (hasVrack === 'has' && v.currentState.vrackId) ||
      (hasVrack === "doesn't have" && !v.currentState.vrackId),
  );
  this.testContext.data.vsIndex = vsIndex;
  this.testContext.data.selectedVrackServices = vrackServicesList[vsIndex];
});

Given(
  'User has a vRack Services that {string} a subnet and a status {word}',
  function(
    this: ICustomWorld<ConfigParams>,
    hasSubnet: 'has' | "doesn't have",
    resourceStatus: ResourceStatus,
  ) {
    const index = vrackServicesList.findIndex(
      (v) =>
        (hasSubnet === 'has'
          ? v.currentState.subnets.length > 0
          : v.currentState.subnets.length === 0) &&
        v.resourceStatus === resourceStatus,
    );

    this.testContext.data.selectedVrackServices = vrackServicesList[index];
    this.testContext.data.vsIndex = index;
  },
);

Given(
  'User has a vRack Services that {string} a subnet and {string} an endpoint and a status {word}',
  function(
    this: ICustomWorld<ConfigParams>,
    hasSubnet: 'has' | "doesn't have",
    hasEndpoint: 'has' | "doesn't have",
    resourceStatus: ResourceStatus,
  ) {
    const index = vrackServicesList.findIndex((v) => {
      if (hasSubnet === 'has' && v.currentState.subnets.length === 0) {
        return false;
      }
      if (hasSubnet === "doesn't have" && v.currentState.subnets.length > 0) {
        return false;
      }
      if (v.resourceStatus !== resourceStatus) {
        return false;
      }
      return hasEndpoint === 'has'
        ? v.currentState.subnets.some(
            (subnet) => subnet.serviceEndpoints.length > 0,
          )
        : v.currentState.subnets.every(
            (subnet) => subnet.serviceEndpoints.length === 0,
          );
    });

    this.testContext.data.selectedVrackServices = vrackServicesList[index];
    this.testContext.data.vsIndex = index;
  },
);

Given(
  'User wants to create a subnet with name {string} and CIDR {string} and service range {string} and vlan {string}',
  function(
    this: ICustomWorld<ConfigParams>,
    name: string,
    cidr: string,
    serviceRange: string,
    vlan: string,
  ) {
    this.testContext.data.name = name;
    this.testContext.data.cidr = cidr;
    this.testContext.data.serviceRange = serviceRange;
    this.testContext.data.vlan = vlan;
  },
);
