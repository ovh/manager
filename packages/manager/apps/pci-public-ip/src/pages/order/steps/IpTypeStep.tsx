import { useTranslation } from 'react-i18next';
import { useData } from '@/api/hooks/useData';
import { IPTypeEnum, StepIdsEnum } from '@/api/types';
import { useOrderStore } from '@/pages/order/hooks/useStore';
import { useActions } from '@/pages/order/hooks/useActions';
import { StepComponent } from '@/components/container/Step.component';
import { IpTypeInputComponent } from '@/components/input/IpTypeInput.component';

export const IpTypeStep = ({
  projectId,
  regionName,
}: {
  projectId: string;
  regionName: string;
}): JSX.Element => {
  const { t: tOrder } = useTranslation('order');
  const { form, steps, setForm } = useOrderStore();
  const { On } = useActions(projectId);
  const { state: dataState } = useData(projectId, regionName);

  return (
    <StepComponent
      {...steps.get(StepIdsEnum.IP_TYPE)}
      title={tOrder('pci_additional_ip_create_step_select_ip')}
      next={dataState.ipTypes.length > 0 ? { action: On.next } : {}}
      onEdit={On.edit}
      order={1}
    >
      <IpTypeInputComponent
        ipTypes={dataState.ipTypes}
        value={form.ipType}
        onInput={(value: string) => {
          setForm({ ...form, ipType: value as IPTypeEnum });
        }}
      />
    </StepComponent>
  );
};
