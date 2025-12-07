import { useLocale } from '@/hooks/useLocale';
import { bytesConverter, octetConverter } from '@/lib/bytesHelper';

export function useLocaleBytesConverter() {
  const locale = useLocale();

  const converter = (value: number, si = false, dp = 1) => {
    if (locale?.toLowerCase().startsWith('fr')) {
      return octetConverter(value, si, dp);
    }
    return bytesConverter(value, si, dp);
  };

  return converter;
}
