import { TInstanceDto } from '@/types/instance/api.type';

export const buildPartialInstanceDto = <
  TData extends { id: string } = TInstanceDto,
  T extends Pick<TData, 'id'> & Partial<TData> = Pick<TInstanceDto, 'id'> &
    Partial<TData>
>(
  initial: T,
) => ({
  with<K extends keyof TData>(key: K, value: TData[K]) {
    return buildPartialInstanceDto({ ...initial, [key]: value });
  },
  build() {
    return initial;
  },
});
