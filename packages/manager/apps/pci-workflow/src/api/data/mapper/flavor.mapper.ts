import { TFlavorDto } from '@/types/flavor/api';
import { TEFlavor } from '@/types/flavor/entity';

export const mapDtoToFlavor = (flavor: TFlavorDto): TEFlavor => ({
  ...flavor,
});
