import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { NewPrivateNetworkForm } from '@/types/private-network-form.type';
import { NEW_PRIVATE_NETWORK_FORM_SCHEMA } from '@/pages/new/new.constants';

export function NewPrivateNetworkWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const form = useForm<NewPrivateNetworkForm>({
    resolver: zodResolver(NEW_PRIVATE_NETWORK_FORM_SCHEMA),
  });

  return <FormProvider {...form}>{children}</FormProvider>;
}
