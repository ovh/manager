import { useState } from 'react';

const modalTypes = [
  'cookies',
  'payment',
  'agreements',
];
const useModals = () => {
  const [ currentIndex, setCurrentIndex ] = useState<number>(0);

  return {
    current: modalTypes[currentIndex],
    next: () => {
      setCurrentIndex((current) => current + 1)
    },
  };
};

export default useModals;
