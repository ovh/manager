import { CategoryEnum } from "@/types/cloud/project/database/engine";
import { useParams } from "react-router-dom";
import OnboardingAnalytics from "./OnboardingAnalytics.component";
import OnboardingDatabases from "./OnboardingDatabases.component";


const Onboarding = () => {
  const { category } = useParams();
  switch (category) {
    case CategoryEnum.analysis:
      return <OnboardingAnalytics />;
    case CategoryEnum.operational:
      return <OnboardingDatabases />;
    default:
      return null;
  }
};

export default Onboarding;
