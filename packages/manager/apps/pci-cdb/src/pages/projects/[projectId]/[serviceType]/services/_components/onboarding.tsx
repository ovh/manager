import { H2, P } from '@/components/typography';
import { database } from '@/models/database';

interface OnboardingProps {
  serviceType: database.ServiceTypeEnum;
}

const Onboarding = ({ serviceType }: OnboardingProps) => {
  return (
    <>
      <H2>Onboarding</H2>
      <P>Page d'onboarding pour le type {serviceType}</P>
    </>
  );
};

export default Onboarding;
