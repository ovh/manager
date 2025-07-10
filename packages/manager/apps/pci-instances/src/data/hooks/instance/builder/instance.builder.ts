import { TInstance, TPartialInstance } from '@/types/instance/entity.type';

export const buildPartialInstance = (initial: TPartialInstance) => ({
  with<K extends keyof TInstance>(key: K, value: TInstance[K]) {
    return buildPartialInstance({ ...initial, [key]: value });
  },
  build() {
    return initial;
  },
});
