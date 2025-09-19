import { APP_FEATURES } from '@/App.constants';

const { basePrefix } = APP_FEATURES;
export function getRoot(): string {
  return basePrefix ? `/${String(basePrefix)}` : '';
}
