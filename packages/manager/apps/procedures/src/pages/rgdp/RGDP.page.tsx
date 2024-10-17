import React from 'react';
import { PageLayout } from '@/components/PageLayout/PageLayout.component';
import { RGDPIntroduction } from './rgdpIntroduction/RGDPIntroduction.component';
import { RGDPForm } from './rgdpForm/RGDPForm.component';

export default function RGDP() {
  return (
    <PageLayout>
      <RGDPIntroduction />
      <RGDPForm />
    </PageLayout>
  );
}
