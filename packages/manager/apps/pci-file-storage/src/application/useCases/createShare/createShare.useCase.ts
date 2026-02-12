import { CreateSharePort } from '@/application/ports/createShare.port';
import { CreateShare } from '@/domain/entities/share.entity';
import { isCreateShareValid } from '@/domain/services/share.service';

export type CreateShareCommand = {
  name: string;
  type: string;
  networkId: string;
  size: number;
  region: string;
};

const mapCommandToEntity = (command: CreateShareCommand): CreateShare => ({
  name: command.name,
  type: command.type,
  network: { id: command.networkId },
  size: command.size,
  region: command.region,
});

export const createShareUseCase =
  (createSharePort: CreateSharePort, projectId: string) =>
  async (command: CreateShareCommand): Promise<void> => {
    const createShare = mapCommandToEntity(command);

    if (!isCreateShareValid(createShare)) {
      throw new Error('Invalid create share configuration');
    }

    await createSharePort.createShare({ projectId, createShare });
  };
