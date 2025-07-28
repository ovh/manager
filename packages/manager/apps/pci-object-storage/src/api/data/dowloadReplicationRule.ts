import { saveAs } from 'file-saver';
import { TReplication } from '@/pages/objects/container/object/replication/ReplicationList.page';

export const downloadReplicationRules = (
  replications: TReplication[],
  projectId: string,
) => {
  const data = {
    Role: `arn:aws:iam::${projectId}:role/s3-replication`,
    Rules: replications,
  };

  const dataStr = JSON.stringify(data, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });

  saveAs(blob, 'replicationRules.json');
};
