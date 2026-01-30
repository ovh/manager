/**
 *  id: gateway_size_region
 *  Ex: 'gateway_s_BHS1.PREPROD'
 */
type TRegionalizedGatewayID = string;

export type TGatewaySizeID = 's' | 'm' | 'l' | 'xl' | '2xl';

type TMicroRegionID = string;

type TPublicIpType = 'PublicIP' | 'FloatingIP';

export type TPrice = {
  currencyCode: string;
  priceInUcents: number;
  text: string;
  value: number;
};

/**
 *  id: public_ip_type_region
 *  Ex: 'PublicIP_BHS1.PREPROD'
 */
type TRegionalizedPublicIpID = string;

export type TRegionalizedPublicIp = {
  id: TRegionalizedPublicIpID;
  type: TPublicIpType;
  region: TMicroRegionID;
  price: TPrice;
};

export type TRegionalizedGateway = {
  id: TRegionalizedGatewayID;
  size: TGatewaySizeID;
  region: TMicroRegionID;
  price: TPrice;
};

export type TNetworkCatalog = {
  gateway: {
    byId: Map<TRegionalizedGatewayID, TRegionalizedGateway>;
    allIds: TRegionalizedGatewayID[];
  };
  publicIp: {
    byId: Map<TRegionalizedPublicIpID, TRegionalizedPublicIp>;
    allIds: TRegionalizedPublicIpID[];
  };
};
