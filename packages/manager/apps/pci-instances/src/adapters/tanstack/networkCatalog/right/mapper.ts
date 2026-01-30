import {
  TNetworkCatalog,
  TRegionalizedGateway,
  TRegionalizedPublicIp,
  TPrice,
  TGatewaySizeID,
} from '@/domain/entities/networkCatalog';
import {
  TNetworkCatalogDTO,
  TPriceDTO,
  TRouterModelDTO,
  TIpModelDTO,
} from './dto.type';
import { getRegionalizedGatewayId, getRegionalizedPublicIpId } from '@/utils';

const mapPriceDTOToPrice = (dto: TPriceDTO): TPrice => ({
  currencyCode: dto.currencyCode,
  priceInUcents: dto.priceInUcents,
  text: dto.text,
  value: dto.value,
});

const mapRouterModelDTOToRegionalizedGateway = (
  routerModel: TRouterModelDTO,
  region: string,
  price: TPriceDTO,
): TRegionalizedGateway => {
  const id = getRegionalizedGatewayId(routerModel.name, region);
  return {
    id,
    size: routerModel.name as TGatewaySizeID,
    region,
    price: mapPriceDTOToPrice(price),
  };
};

const mapIpModelDTOToRegionalizedPublicIp = (
  ipModel: TIpModelDTO,
  region: string,
  price: TPriceDTO,
): TRegionalizedPublicIp => {
  const id = getRegionalizedPublicIpId(ipModel.type, region);
  return {
    id,
    type: ipModel.type,
    region,
    price: mapPriceDTOToPrice(price),
  };
};

type TNormalizedGateways = {
  byId: Map<string, TRegionalizedGateway>;
  allIds: string[];
};

type TNormalizedPublicIps = {
  byId: Map<string, TRegionalizedPublicIp>;
  allIds: string[];
};

const normalizeGateways = (
  routersModels: TRouterModelDTO[],
): TNormalizedGateways =>
  routersModels.reduce(
    (acc, routerModel) =>
      routerModel.pricings.reduce(
        (pricingAcc, pricing) =>
          pricing.regions.reduce((regionAcc, region) => {
            const gateway = mapRouterModelDTOToRegionalizedGateway(
              routerModel,
              region,
              pricing.price,
            );

            if (!regionAcc.allIds.includes(gateway.id))
              regionAcc.allIds.push(gateway.id);

            regionAcc.byId.set(gateway.id, gateway);

            return regionAcc;
          }, pricingAcc),
        acc,
      ),
    {
      byId: new Map<string, TRegionalizedGateway>(),
      allIds: [],
    } as TNormalizedGateways,
  );

const normalizePublicIps = (ipModels: TIpModelDTO[]): TNormalizedPublicIps =>
  ipModels.reduce(
    (acc, ipModel) =>
      ipModel.pricings.reduce(
        (pricingAcc, pricing) =>
          pricing.regions.reduce((regionAcc, region) => {
            const publicIp = mapIpModelDTOToRegionalizedPublicIp(
              ipModel,
              region,
              pricing.price,
            );

            if (!regionAcc.allIds.includes(publicIp.id))
              regionAcc.allIds.push(publicIp.id);

            regionAcc.byId.set(publicIp.id, publicIp);

            return regionAcc;
          }, pricingAcc),
        acc,
      ),
    {
      byId: new Map<string, TRegionalizedPublicIp>(),
      allIds: [],
    } as TNormalizedPublicIps,
  );

export const mapNetworkCatalogDtoToEntity = (
  dto: TNetworkCatalogDTO,
): TNetworkCatalog => {
  const gatewayResult = normalizeGateways(dto.routersModels);
  const publicIpResult = normalizePublicIps(dto.ipModels);

  return {
    gateway: gatewayResult,
    publicIp: publicIpResult,
  };
};
