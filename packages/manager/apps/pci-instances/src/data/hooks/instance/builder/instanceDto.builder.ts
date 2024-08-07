import { TInstanceDto, TPartialInstanceDto } from '@/types/instance/api.type';

export const buildPartialInstanceDto = (initial: TPartialInstanceDto) => ({
  with<K extends keyof TInstanceDto>(
    key: keyof TInstanceDto,
    value: TPartialInstanceDto[K],
  ) {
    return buildPartialInstanceDto({ ...initial, [key]: value });
  },
  build() {
    return initial;
  },
});
