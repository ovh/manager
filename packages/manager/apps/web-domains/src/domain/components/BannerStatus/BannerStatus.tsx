import React from 'react';
import BannerErrorWarning from '@/domain/components/BannerStatus/BannerErrorWarning';
import BannerInfo from '@/domain/components/BannerStatus/BannerInfo';

interface BannerStatusProps {
  readonly serviceName: string;
}

export default function BannerStatus({ serviceName }: BannerStatusProps) {
  return (
    <>
      <BannerInfo serviceName={serviceName} />
      <BannerErrorWarning serviceName={serviceName} />
    </>
  );
}
