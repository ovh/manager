import { useState } from 'react';
import { ActionMenu } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { TIPRestrictionsData } from '@/types';
import DeleteModal from './DeleteModal.component';

export default function ActionComponent({
  cidr,
}: {
  cidr: TIPRestrictionsData;
}) {
  const { t } = useTranslation(['ip-restrictions']);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const items = [
    {
      id: 0,
      label: t('ip_restrictions_delete_block'),
      disabled: false,
      onClick: () => {
        setOpenDeleteModal(true);
      },
    },
  ];

  return (
    <>
      <ActionMenu items={items} isCompact />
      {openDeleteModal && (
        <DeleteModal onClose={() => setOpenDeleteModal(false)} cidr={cidr} />
      )}
    </>
  );
}
