import { TrackingContextParams } from '@ovh-ux/manager-react-shell-client';

export const getTrackingContext = (appName: string): TrackingContextParams => ({
  chapter1: 'Baremetal',
  chapter2: 'Network',
  chapter3: appName,
  appName,
  level2: '57',
  pageTheme: 'DedicatedServers',
});

export enum PageName {
  associate = 'associate',
  associateAnother = 'associate_another_vrack',
  dissociate = 'dissociate',
  createVrack = 'create-vrack',
  delete = 'delete_vrack-services',
  createVrackServices = 'add_vrack-services',
  overview = 'general-informations',
  subnets = 'subnets',
  createSubnets = 'add_subnets',
  deleteSubnets = 'delete_subnets',
  endpoints = 'endpoints',
  createEndpoints = 'add_endpoints',
  deleteEndpoints = 'delete_endpoints',

  pendingCreateSubnet = 'create_subnets_pending',
  errorCreateSubnet = 'create_subnets_error',
  pendingUpdateSubnet = 'update_subnets_pending',
  errorUpdateSubnet = 'update_subnets_error',
  pendingDeleteSubnet = 'delete_subnets_pending',
  errorDeleteSubnet = 'delete_subnets_error',

  pendingCreateEndpoint = 'create_endpoints_pending',
  errorCreateEndpoint = 'create_endpoints_error',
  pendingUpdateEndpoint = 'update_endpoints_pending',
  errorUpdateEndpoint = 'update_endpoints_error',
  pendingDeleteEndpoint = 'delete_endpoints_pending',
  errorDeleteEndpoint = 'delete_endpoints_error',

  pendingCreateVrackServices = 'create_vrack-services_pending',
  errorCreateVrackServices = 'create_vrack-services_error',
  pendingUpdateVrackServices = 'update_vrack-services_pending',
  errorUpdateVrackServices = 'update_vrack-services_error',
  pendingDeleteVrackServices = 'delete_vrack-services_pending',
  errorDeleteVrackServices = 'delete_vrack-services_error',

  successAssociateAnotherVrack = 'associate_another_vrack_success',
  errorAssociateAnotherVrack = 'associate_another_vrack_error',
}
