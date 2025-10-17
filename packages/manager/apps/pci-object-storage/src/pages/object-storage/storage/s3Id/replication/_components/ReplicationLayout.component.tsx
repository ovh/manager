import { ArrowLeft } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button, Form } from '@datatr-ux/uxlib';
import { ReplicationForm } from './ReplicationForm.component';
import { AddReplicationFormValues } from '../new/useAddReplicationForm.hook';
import { FormattedStorage } from '@/types/Storages';
import Link from '@/components/links/Link.component';

interface ReplicationLayoutProps {
  title: string;
  isLoading: boolean;
  form: UseFormReturn<AddReplicationFormValues>;
  availableDestinations: FormattedStorage[];
  isPending: boolean;
  onSubmit: () => void;
  submitButtonText: string;
}

export const ReplicationLayout = ({
  title,
  form,
  availableDestinations,
  isPending,
  onSubmit,
  submitButtonText,
}: ReplicationLayoutProps) => {
  const { t } = useTranslation('pci-object-storage/replication');

  return (
    <>
      <div>
        <h3>{title}</h3>

        <Link to="../replication" className="flex items-center">
          <ArrowLeft className="w-4 h-4 mr-2" /> {t('backLink')}
        </Link>
      </div>
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-4">
          <ReplicationForm
            form={form}
            availableDestinations={availableDestinations}
            isPending={isPending}
          />
        </form>
      </Form>

      <Button type="submit" disabled={isPending} onClick={onSubmit}>
        {submitButtonText}
      </Button>
    </>
  );
};
