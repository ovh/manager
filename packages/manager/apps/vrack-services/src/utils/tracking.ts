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
  edit = 'edit_vrack-services',
  createVrack = 'create-vrack',
  delete = 'delete_vrack-services',
  createVrackServices = 'add_vrack-services',
  overview = 'general-informations',
  subnets = 'subnets',
  createSubnets = 'add_subnets',
  editSubnets = 'edit_subnets',
  deleteSubnets = 'delete_subnets',
  endpoints = 'endpoints',
  createEndpoints = 'add_endpoints',
  editEndpoints = 'edit_endpoints',
  deleteEndpoints = 'delete_endpoints',

  successCreateSubnet = 'create_subnets_success',
  errorCreateSubnet = 'create_subnets_error',
  successUpdateSubnet = 'update_subnets_success',
  errorUpdateSubnet = 'update_subnets_error',
  successDeleteSubnet = 'delete_subnets_success',
  errorDeleteSubnet = 'delete_subnets_error',

  successCreateEndpoint = 'create_endpoints_success',
  errorCreateEndpoint = 'create_endpoints_error',
  successUpdateEndpoint = 'update_endpoints_success',
  errorUpdateEndpoint = 'update_endpoints_error',
  successDeleteEndpoint = 'delete_endpoints_success',
  errorDeleteEndpoint = 'delete_endpoints_error',

  pendingCreateVrackServices = 'create_vrack-services_pending',
  errorCreateVrackServices = 'create_vrack-services_error',
  successUpdateVrackServices = 'update_vrack-services_success',
  errorUpdateVrackServices = 'update_vrack-services_error',
  successDeleteVrackServices = 'delete_vrack-services_success',
  errorDeleteVrackServices = 'delete_vrack-services_error',

  successAssociateVrack = 'associate_vrack_success',
  errorAssociateVrack = 'associate_vrack_error',
  successDissociateVrack = 'dissociate_vrack_success',
  errorDissociateVrack = 'dissociate_vrack_error',
}
