import { FC, PropsWithChildren } from 'react';
import { useFormContext } from 'react-hook-form';
import IpInput from '@/components/ip/IpInput.component';
import { NewPrivateNetworkForm } from '@/types/private-network-form.type';

const DNSInputEdit: FC<PropsWithChildren<{ position: number }>> = ({
  children,
  position,
}) => {
  const {
    formState: { touchedFields, errors },
    setValue,
    watch,
  } = useFormContext<NewPrivateNetworkForm>();
  const dnsServers = watch('subnet.dnsNameServers');

  const isTouched = touchedFields.subnet?.dnsNameServers;
  const isErrors = isTouched && !!errors.subnet?.dnsNameServers?.[position];
  const value = dnsServers?.[position];

  const onValueChange = ({ target }) => {
    const dnsServer = target.value;

    const updatedDNS = [...dnsServers];
    updatedDNS[position] = dnsServer;

    setValue('subnet.useDefaultPublicDNSResolver', false);
    setValue('subnet.dnsNameServers', updatedDNS, {
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  return (
    <IpInput error={isErrors} value={value} onValueChange={onValueChange}>
      {children}
    </IpInput>
  );
};

export default DNSInputEdit;
