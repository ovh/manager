import { useState } from 'react';

const useSidebar = (options = {}) => {
  const [isOpen, setIsOpen] = useState(options.isOpen || false);

  const toggleIsOpenState = () => {
    setIsOpen(!isOpen);
  };

  const open = () => {
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    toggleIsOpenState,
    open,
    close,
  };
};

export default useSidebar;
