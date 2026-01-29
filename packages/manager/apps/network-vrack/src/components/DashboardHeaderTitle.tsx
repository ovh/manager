import { Vrack } from '@/data/api/get/vrackDetails';
import { useUpdateVrackDetails } from '@/hooks/vrack/useUpdateVrackDetails';

import { EditableText } from './editable-text/EditableText';

interface DashboardHeaderTitleProps {
  vrack: Vrack;
}

export const DashboardHeaderTitle = (props: DashboardHeaderTitleProps) => {
  const vrack = props.vrack;

  const { mutate: updateVrackDetails } = useUpdateVrackDetails(vrack.serviceName);

  const onVrackNameUpdate = (updatedName: string) => {
    updateVrackDetails({
      name: updatedName,
      description: vrack.description,
    });
  };
  return (
    <div>
      <EditableText preset="heading-2" value={vrack.name} onUpdate={onVrackNameUpdate} />
    </div>
  );
};
