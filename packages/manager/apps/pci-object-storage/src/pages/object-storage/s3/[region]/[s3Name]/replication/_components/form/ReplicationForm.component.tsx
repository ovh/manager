import { UseFormReturn } from 'react-hook-form';
import { ReplicationFormValues } from './useReplicationForm.hook';
import { ReplicationFormProvider } from './ReplicationForm.context';
import { ReplicationRuleIdentification } from './ReplicationRuleIdentification.component';
import { ReplicationRuleScope } from './ReplicationRuleScope.component';
import { ReplicationRuleDestination } from './ReplicationRuleDestination.component';
import { ReplicationRuleAdvanced } from './ReplicationRuleAdvanced.component';

interface ReplicationFormProps {
  isEditMode?: boolean;
  replicationTitle: string;
  form: UseFormReturn<ReplicationFormValues>;
  isPending: boolean;
  onSubmit: () => void;
}

export const ReplicationForm = ({
  isEditMode = false,
  replicationTitle,
  form,
  isPending,
  onSubmit,
}: ReplicationFormProps) => (
  <ReplicationFormProvider
    form={form}
    isPending={isPending}
    isEditMode={isEditMode}
    replicationTitle={replicationTitle}
  >
    <form onSubmit={onSubmit} className="space-y-4" id="replication-form">
      <ReplicationRuleIdentification />
      <ReplicationRuleScope />
      <ReplicationRuleDestination />
      <ReplicationRuleAdvanced />
    </form>
  </ReplicationFormProvider>
);
