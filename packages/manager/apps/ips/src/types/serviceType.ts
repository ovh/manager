export const ipParkingOptionValue = 'parking';

export enum ServiceType {
  vrack = 'VRACK',
  vps = 'VPS',
  dedicatedCloud = 'DEDICATED_CLOUD',
  vcfaas = 'VCFAAS',
  ipParking = 'IP_PARKING',
  server = 'SERVER',
  unknown = 'unknown',
}

export enum IpVersion {
  ipv4 = 'ipv4',
  ipv6 = 'ipv6',
}

/**
 * Only dedicatedCloud (Hosted Private Cloud) is treated as a private cloud in
 * the steps that follow the service selection (PCC catalog/pricing, orderable
 * countries, order params with productId 'privateCloud', hidden organisation
 * section, gb geolocation kept as-is).
 *
 * VCFaaS is intentionally NOT included here: once selected it behaves like a
 * regular (non-privateCloud) IP order — offers and pricing come from
 * `/order/catalog/formatted/ip`, productId is 'ip', the organisation section is
 * shown, etc. VCFaaS-specific behaviour (NSX listing, availability, automatic
 * region) is handled through explicit `ServiceType.vcfaas` checks elsewhere.
 */
export const isPrivateCloudServiceType = (serviceType?: ServiceType) =>
  serviceType === ServiceType.dedicatedCloud;
