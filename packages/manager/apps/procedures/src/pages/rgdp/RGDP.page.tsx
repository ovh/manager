import React from 'react';

import { PageLayout } from '@/components/PageLayout/PageLayout.component';
import { LegalInformations } from '@/components/legalInformations/LegalInformations.component';

import { LEGAL_INFORMATIONS_RETENTION_DAYS } from './RGPD.constants';
import { RGDPForm } from './rgdpForm/RGDPForm.component';
import { RGDPIntroduction } from './rgdpIntroduction/RGDPIntroduction.component';

export default function RGDP() {
  return (
    <PageLayout>
      <RGDPIntroduction />
      <RGDPForm />
      <LegalInformations
        translationNamespace="rgdp"
        informationTranslationKey="rgdp_legal_information"
        informationInterpolation={{
          retentionDays: LEGAL_INFORMATIONS_RETENTION_DAYS,
        }}
        policyTanslationKey="rgdp_legal_information_policy"
      />
    </PageLayout>
  );
}
