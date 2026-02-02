import { useParams } from 'react-router-dom';
import { CategoryEnum } from '@/types/cloud/project/database/engine';
import OnboardingAnalytics from './OnboardingAnalytics.component';
import OnboardingDatabases from './OnboardingDatabases.component';

const Onboarding = () => {
  const { category } = useParams<{ category: string }>();

  if (category === CategoryEnum.analysis) {
    return <OnboardingAnalytics />;
  }

  if (category === CategoryEnum.operational) {
    return <OnboardingDatabases />;
  }

  return null;
};

export default Onboarding;
