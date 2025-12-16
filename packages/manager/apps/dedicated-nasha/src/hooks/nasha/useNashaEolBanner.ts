import { useFeatureAvailability } from '@ovh-ux/manager-react-shell-client';
import { Nasha } from '@/types/nasha.type';

export const useNashaEolBanner = (nasha?: Nasha) => {
  const { data: featureAvailability } = useFeatureAvailability(['dedicated-nasha:eol-lv1-lv2']);
  
  const isFeatureAvailable = featureAvailability?.['dedicated-nasha:eol-lv1-lv2'] ?? false;
  
  if (!nasha) return false;

  const isLegacyService = ['rbx', 'sbg', 'bhs'].includes(nasha.datacenter.toLowerCase()) && nasha.diskType === 'hdd';
  
  return isFeatureAvailable && isLegacyService;
};

