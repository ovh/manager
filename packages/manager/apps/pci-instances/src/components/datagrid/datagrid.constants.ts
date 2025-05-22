import { buildPartialInstanceDto } from '@/data/hooks/instance/builder/instanceDto.builder';

export const getPartialDeletedInstanceDto = (id: string) =>
  buildPartialInstanceDto({ id })
    .with('actions', [])
    .with('addresses', [])
    .with('volumes', [])
    .with('status', 'DELETED')
    .with('pendingTask', false)
    .build();
