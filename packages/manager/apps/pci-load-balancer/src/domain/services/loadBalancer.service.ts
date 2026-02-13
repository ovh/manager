export type TLoadBalancerSizeCode = 's' | 'm' | 'l' | 'xl';

const SIZE_TO_LABEL: Record<TLoadBalancerSizeCode, string> = {
  s: 'small',
  m: 'medium',
  l: 'large',
  xl: 'xl',
};

const isKnownSize = (size: string): size is TLoadBalancerSizeCode => size in SIZE_TO_LABEL;

export const mapFlavorSizeToLabel = (size: string): string =>
  isKnownSize(size) ? SIZE_TO_LABEL[size] : size;
