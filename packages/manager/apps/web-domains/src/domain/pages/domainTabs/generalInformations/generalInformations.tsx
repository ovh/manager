import React from 'react';
import { useParams } from 'react-router-dom';
import BannerStatus from '@/domain/components/BannerStatus/BannerStatus';

export default function GeneralInformations() {
  const { serviceName } = useParams<{ serviceName: string }>();

  return (
    <div>
      <BannerStatus serviceName={serviceName} />
    </div>
  );
}
