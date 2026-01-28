import { ReactNode, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalOpenChangeDetail,
  Spinner,
  Text,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Button } from '@ovh-ux/muk';

type IdentitiesSelectionModalProps<T> = {
  title: string;
  isLoading: boolean;
  children: (selected: T[], setSelected: React.Dispatch<React.SetStateAction<T[]>>) => ReactNode;
  initialSelected: T[];
  onSave: (selected: T[]) => void;
};

const IdentitiesSelectionModal = <T,>({
  title,
  isLoading,
  children,
  initialSelected,
  onSave,
}: IdentitiesSelectionModalProps<T>) => {
  const { t } = useTranslation(NAMESPACES.ACTIONS);
  const [selectedItems, setSelectedItems] = useState<T[]>(initialSelected);
  const navigate = useNavigate();

  const closeModal = () => navigate('..');

  const handleClose = (detail: ModalOpenChangeDetail) => {
    if (!detail.open) {
      closeModal();
    }
  };

  const handleSave = () => {
    onSave(selectedItems);
    closeModal();
  };

  return (
    <Modal onOpenChange={handleClose} open>
      <ModalContent
        color="information"
        dismissible
        className="flex max-h-[90vh] max-w-[800px] flex-col"
      >
        <ModalBody className="flex min-h-0 flex-col space-y-4">
          <Text preset="heading-3">{title}</Text>
          <div className="mt-4 min-h-0 flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center">
                <Spinner size="sm" />
              </div>
            ) : (
              children(selectedItems, setSelectedItems)
            )}
          </div>
          <div className="flex shrink-0 justify-end gap-2">
            <Button type="button" variant="ghost" color="primary" onClick={closeModal}>
              {t('cancel', { ns: NAMESPACES.ACTIONS })}
            </Button>
            <Button disabled={isLoading} type="button" color="primary" onClick={handleSave}>
              {t('add', { ns: NAMESPACES.ACTIONS })}
            </Button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default IdentitiesSelectionModal;
