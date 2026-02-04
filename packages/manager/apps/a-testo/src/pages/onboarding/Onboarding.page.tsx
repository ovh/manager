import { OnboardingLayout } from '@ovh-ux/muk';

const OnboardingPage = () => {
  return (
    <OnboardingLayout
      title="A Testo"
      description="A Testo is a service that allows you to test your code."
      orderButtonLabel="Order Now"
      orderHref="https://example.com/order"
      moreInfoButtonLabel="Learn More"
      moreInfoHref="https://example.com/more-info"
      orderIam={{
        urn: 'urn:v1:eu:resource:vrackServices:vrs-bby-zkm-3a9-tlk',
        iamActions: ['vrackServices:apiovh:resource/edit'],
      }}
    />
  );
};

export default OnboardingPage;
