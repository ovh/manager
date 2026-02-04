import { useState } from 'react';
import { ModalOpenChangeDetail } from '@ovhcloud/ods-react';

export const useDomainListModals = () => {
  const [isModalOpened, setIsModalOpened] = useState(false);
  const [modalServiceNames, setModalServiceNames] = useState<string[]>([]);

  const openModal = (serviceNames: string[]) => {
    setModalServiceNames(serviceNames);
    setIsModalOpened(true);
  };

  const onOpenChange = ({ open }: ModalOpenChangeDetail) => {
    setIsModalOpened(open);
  };

  return {
    isModalOpened,
    modalServiceNames,
    openModal,
    onOpenChange,
  };
};
