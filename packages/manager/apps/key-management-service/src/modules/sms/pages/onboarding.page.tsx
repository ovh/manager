import React from 'react';
import { OdsButton } from '@ovhcloud/ods-components/react';
import { useNavigate } from 'react-router-dom';
import { SMS_ROUTES_URLS } from '@sms/routes/routes.constants';

export default function SmsOnboardingPage() {
  const navigate = useNavigate();
  return (
    <div>
      <h1>SMS Onboarding</h1>
      <p>This page helps you onboard on Secret Management Service.</p>
      <OdsButton
        label="Go to Secrets List"
        onClick={() => navigate(SMS_ROUTES_URLS.secretListing('1234'))}
      />
    </div>
  );
}
