import { PropsWithChildren } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import { NewPrivateNetworkForm } from '@/types/private-network-form.type';
import { NEW_PRIVATE_NETWORK_FORM_SCHEMA } from '@/pages/new/new.constants';

export function NewPrivateNetworkWrapper({ children }: PropsWithChildren) {
  const form = useForm<NewPrivateNetworkForm>({
    resolver: zodResolver(NEW_PRIVATE_NETWORK_FORM_SCHEMA),
  });

  const shellContextValue = {
    shell: {
      navigation: {
        getURL: (_, path) => Promise.resolve(`https://ovh.test/#${path}`),
      },
      ux: {
        hidePreloader: () => Promise.resolve(),
      },
      tracking: {
        trackClick: () => {},
      },
    },
    environment: {
      getUser: () => ({ ovhSubsidiary: 'mocked_ovhSubsidiary' }),
      getRegion: () => 'EU',
    },
  };

  return (
    <ShellContext.Provider
      value={(shellContextValue as unknown) as ShellContextType}
    >
      <FormProvider {...form}>{children}</FormProvider>
    </ShellContext.Provider>
  );
}
