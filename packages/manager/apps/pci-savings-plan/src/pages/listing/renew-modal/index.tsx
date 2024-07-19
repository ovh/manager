import RenewModal from '@/components/Modal/RenewModal';
import React from 'react';

const RenewModalPage = () => {
  return (
    <div>
      <RenewModal
        networkId="123"
        isPending={false}
        onClose={() => {}}
        onConfirm={() => {}}
      />
    </div>
  );
};

export default RenewModalPage;
