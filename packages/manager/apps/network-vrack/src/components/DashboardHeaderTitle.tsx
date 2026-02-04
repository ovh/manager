import { Vrack } from '@/data/api/get/vrackDetails';
import { useUpdateVrackDetails } from '@/hooks/vrack/useUpdateVrackDetails';

import { EditableText } from './editable-text/EditableText';

interface DashboardHeaderTitleProps {
  vrack: Vrack;
}

export const DashboardHeaderTitle = ({ vrack }: DashboardHeaderTitleProps) => {
  const { mutate: updateVrackDetails } = useUpdateVrackDetails(vrack.serviceName);

  const onVrackNameUpdate = (updatedName: string) => {
    updateVrackDetails({
      name: updatedName,
      description: vrack.description,
    });
  };

  return (
    <div>
      <EditableText
        preset="heading-2"
        value={vrack.name || vrack.serviceName}
        onUpdate={onVrackNameUpdate}
      />
    </div>
  );
};
