import {
  TAggregatedInstanceDto,
  TPartialInstanceDto,
} from '@/types/instance/api.type';

export const buildPartialInstanceDto = (initial: TPartialInstanceDto) => ({
  with<K extends keyof TAggregatedInstanceDto>(
    key: keyof TAggregatedInstanceDto,
    value: TPartialInstanceDto[K],
  ) {
    return buildPartialInstanceDto({ ...initial, [key]: value });
  },
  build() {
    return initial;
  },
});
