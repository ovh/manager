import { UseFormReturn } from 'react-hook-form';
import { FormattedStorage } from '@/types/Storages';
import { AddReplicationFormValues } from '../new/useAddReplicationForm.hook';
import { ReplicationRuleIdentification } from './ReplicationRuleIdentification.component';
import { ReplicationRuleScope } from './ReplicationRuleScope.component';
import { ReplicationRuleDestination } from './ReplicationRuleDestination.component';
import { ReplicationRuleAdvanced } from './ReplicationRuleAdvanced.component';
import { useReplicationFormState } from '../../../../../../hooks/useReplicationFormState.hook';

type ReplicationFormProps = {
  form: UseFormReturn<AddReplicationFormValues>;
  availableDestinations: FormattedStorage[];
  isPending: boolean;
};

export const ReplicationForm = ({
  form,
  availableDestinations,
  isPending,
}: ReplicationFormProps) => {
  const formState = useReplicationFormState(form);

  return (
    <>
      <ReplicationRuleIdentification form={form} isPending={isPending} />
      <ReplicationRuleScope
        form={form}
        isPending={isPending}
        showScopeFields={formState.showScopeFields}
        isTagsDisabled={formState.isTagsDisabled}
      />
      <ReplicationRuleDestination
        form={form}
        availableDestinations={availableDestinations}
        isPending={isPending}
      />
      <ReplicationRuleAdvanced
        form={form}
        isPending={isPending}
        showStorageClassField={formState.showStorageClassField}
        isDeleteMarkerDisabled={formState.isDeleteMarkerDisabled}
      />
    </>
  );
};
