import React from 'react';
import { PageLayout } from '@/components/PageLayout/PageLayout.component';
import { RGDPIntroduction } from './rgdpIntroduction/RGDPIntroduction.component';
import { RGDPForm } from './rgdpForm/RGDPForm.component';
import { LegalInformations } from '@/components/legalInformations/LegalInformations.component';

export default function RGDP() {
  return (
    <PageLayout>
      <RGDPIntroduction />
      <RGDPForm />
      <LegalInformations
        translationNamespace="rgdp"
        informationTranslationKey="rgdp_legal_information"
        policyTanslationKey="rgdp_legal_information_policy"
      />
    </PageLayout>
  );
}
