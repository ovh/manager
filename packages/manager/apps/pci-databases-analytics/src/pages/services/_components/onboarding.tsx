import { OnboardingLayout } from '@ovhcloud/manager-components';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import onboardingImgSrc from '../../../public/assets/onboarding-image.png';

const Onboarding = () => {
  const { t } = useTranslation('pci-databases-analytics/services/onboarding');
  const navigate = useNavigate();
  const { projectId } = useParams();
  const title: string = t('title');
  const description: string = t('description');
  // useTrackingPage(TrackingPageView.Onboarding);
  // const trackAction = useTrackingAction();
  const onOrderButtonClick = () => {
    // trackAction(TrackingPageView.Onboarding, TrackingEvent.add);
    navigate('new');
  };
  return (
    <OnboardingLayout
      title={title}
      img={{ src: onboardingImgSrc, width: 450, height: 250 }}
      description={description}
      orderButtonLabel={t('create-service-button')}
      onOrderButtonClick={onOrderButtonClick}
    />
  );
};

export default Onboarding;
