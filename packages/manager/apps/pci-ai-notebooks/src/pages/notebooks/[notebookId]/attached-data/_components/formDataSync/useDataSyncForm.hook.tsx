import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import * as ai from '@/types/cloud/project/ai';

export const useDataSyncForm = () => {
  const dataSyncTypeRules = z.nativeEnum(ai.volume.DataSyncEnum);

  const schema = z.object({
    type: dataSyncTypeRules,
  });

  type ValidationSchema = z.infer<typeof schema>;

  const defaultValues: ValidationSchema = {
    type: ai.volume.DataSyncEnum.pull,
  };

  const form = useForm<ValidationSchema>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return { form, schema };
};
