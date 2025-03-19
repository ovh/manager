import { useTranslation } from 'react-i18next';
import {
  OdsButton,
  OdsFormField,
  OdsInput,
  OdsText,
  OdsSpinner,
} from '@ovhcloud/ods-components/react';
import { FormEvent, useCallback } from 'react';
import { TSnapshot } from '@/api/data/snapshots';

export interface PciStorageVolumeEditProps {
  isLoading: boolean;
  snapshot: TSnapshot;
  submitLabel: string;
  onSubmit: () => void;
  onCancel: () => void;
}

export default function PciStorageVolumeEdit({
  isLoading,
  snapshot,
  submitLabel,
  onSubmit,
  onCancel,
}: Readonly<PciStorageVolumeEditProps>) {
  const { t } = useTranslation('volume-edit');

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onSubmit();
    },
    [onSubmit],
  );

  if (isLoading) {
    return <OdsSpinner />;
  }

  console.group('[default] PciStorageVolumeEdit');
  console.log('snapshot: ', snapshot);
  console.groupEnd();

  return (
    <form className="flex flex-col" onSubmit={handleSubmit}>
      <OdsFormField className="my-4 w-full">
        <OdsText className={'font-bold-class'} preset="caption">
          {t(
            'pci_projects_project_storages_blocks_block_volume-edit_region_label',
          )}
        </OdsText>
        <OdsText>Muf 2</OdsText>
      </OdsFormField>
      <OdsFormField className="my-4 w-full">
        <OdsText className={'font-bold-class'} preset="caption">
          {t(
            'pci_projects_project_storages_blocks_block_volume-edit_type_label',
          )}
        </OdsText>
        <OdsText>{snapshot.name} (todo)</OdsText>
      </OdsFormField>
      <OdsFormField className="my-4 w-full">
        <OdsText className={'font-bold-class'} preset="caption">
          {t(
            'pci_projects_project_storages_blocks_block_volume-edit_name_label',
          )}
        </OdsText>
        <OdsInput name={'nom-du-volume-todo'} />
      </OdsFormField>
      <OdsFormField className="my-4 w-full">
        <OdsText className={'font-bold-class'} preset="caption">
          {t(
            'pci_projects_project_storages_blocks_block_volume-edit_size_label',
          )}
        </OdsText>
        <OdsInput name={'capacite-du-volume-todo'} />
      </OdsFormField>

      <div className="flex mt-8 gap-4">
        <OdsButton
          type="button"
          variant={'outline'}
          onClick={onCancel}
          label={t(
            'pci_projects_project_storages_blocks_block_volume-edit_cancel_label',
          )}
        ></OdsButton>
        <OdsButton type="submit" label={submitLabel}></OdsButton>
      </div>
    </form>
  );
}
