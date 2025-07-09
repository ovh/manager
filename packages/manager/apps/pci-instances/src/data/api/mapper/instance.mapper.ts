import {
  TInstanceDto,
  TInstancePriceDto,
  TInstanceVolumeDto,
} from '@/types/instance/api.type';
import {
  TInstanceAddress,
  TInstance,
  TInstanceAddressType,
  TInstanceVolume,
  TInstanceRegion,
  TInstanceTaskStatus,
  TInstancePrice,
} from '@/types/instance/entity.type';

const mapRegion = (dto: TInstanceDto): TInstanceRegion => ({
  name: dto.region,
  type: dto.regionType,
  availabilityZone: dto.availabilityZone,
});

const mapTask = ({
  pendingTask,
  taskState,
}: TInstanceDto): TInstanceTaskStatus => ({
  isPending: pendingTask,
  status: taskState || null,
});

const mapVolume = (volume: TInstanceVolumeDto): TInstanceVolume => ({
  ...volume,
  name: volume.name ?? null,
  size: volume.size ?? null,
});

const mapPricing = (pricingDto: TInstancePriceDto): TInstancePrice => ({
  ...pricingDto,
  currencyCode: pricingDto.price.currencyCode,
  priceInUcents: pricingDto.price.priceInUcents,
  text: pricingDto.price.text,
  value: pricingDto.price.value,
});

const mapAddresses = (dto: TInstanceDto) =>
  dto.addresses.reduce((acc, { type, ...rest }) => {
    const foundAddresses = acc.get(type);
    if (foundAddresses) {
      const ipAlreadyExists = foundAddresses.find(({ ip }) => ip === rest.ip);
      if (!ipAlreadyExists)
        foundAddresses.push({ ...rest, subnet: rest.subnet ?? null });
      return acc;
    }
    return acc.set(type, [{ ...rest, subnet: rest.subnet ?? null }]);
  }, new Map<TInstanceAddressType, TInstanceAddress[]>());

export const mapDtoToInstance = (dto: TInstanceDto): TInstance => ({
  ...dto,
  region: mapRegion(dto),
  pricings: dto.pricings?.map(mapPricing) ?? null,
  task: mapTask(dto),
  volumes: dto.volumes?.map(mapVolume) ?? null,
  backups: dto.backups ?? null,
  image: dto.image ?? null,
  addresses: mapAddresses(dto),
  flavor: dto.flavor ?? null,
  login: dto.login ?? null,
});
