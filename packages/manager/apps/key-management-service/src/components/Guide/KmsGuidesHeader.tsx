import React from 'react';
import { GuideButton } from '@ovhcloud/manager-components';
import { useKmsGuides } from '@/hooks/useKmsGuides';

export default function KmsGuidesHeader() {
  const { kmsGuides } = useKmsGuides();

  return <GuideButton items={kmsGuides} />;
}
