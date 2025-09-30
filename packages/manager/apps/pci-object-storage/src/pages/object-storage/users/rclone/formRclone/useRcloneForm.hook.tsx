import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ObjectStorageTypeEnum } from '@/types/Storages';

export const useRcloneForm = () => {
  const schema = z.object({
    region: z.string(),
    rcloneType: z.nativeEnum(ObjectStorageTypeEnum),
  });

  type ValidationSchema = z.infer<typeof schema>;

  const defaultValues: ValidationSchema = {
    rcloneType: ObjectStorageTypeEnum.swift,
  };

  const form = useForm<ValidationSchema>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return { form, schema };
};
