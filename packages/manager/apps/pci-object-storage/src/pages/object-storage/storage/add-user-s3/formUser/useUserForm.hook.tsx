import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import storages from '@/types/Storages';
import user from '@/types/User';

export interface UseUserFormProps {
  users: user.User[];
}
export const useUserForm = ({ users }: UseUserFormProps) => {
  const schema = z.object({
    userId: z.number(),
    userRole: z.nativeEnum(storages.PolicyRoleEnum),
  });

  type ValidationSchema = z.infer<typeof schema>;

  const defaultValues: ValidationSchema = {
    userId: users[0].id,
    userRole: storages.PolicyRoleEnum.readOnly,
  };

  const form = useForm<ValidationSchema>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return { form, schema };
};
