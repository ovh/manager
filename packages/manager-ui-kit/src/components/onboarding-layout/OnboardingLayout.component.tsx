import { FC } from 'react';
import { TEXT_PRESET } from '@ovhcloud/ods-react';
import { Text } from '../text';
import { OnboardingLayoutButton } from './onboarding-layout-button';
import { OnboardingLayoutProps } from './OnboardingLayout.type';
import placeholderSrc from '../../../public/assets/placeholder.png';

export const OnboardingLayout: FC<OnboardingLayoutProps> = ({
  hideHeadingSection,
  title,
  description,
  orderButtonLabel,
  orderHref,
  isActionDisabled,
  orderIam,
  onOrderButtonClick,
  moreInfoHref,
  moreInfoButtonLabel,
  moreInfoButtonIcon,
  isMoreInfoButtonDisabled,
  img = {},
  children,
}) => {
  const { className: imgClassName, alt: altText, ...imgProps } = img;
  return (
    <main className="flex flex-col mx-auto sm:px-10">
      {!hideHeadingSection && (
        <section
          className="flex flex-col items-center gap-6 pt-6 max-w-[800px] self-center"
          aria-labelledby="onboarding-title"
        >
          {(img?.src || placeholderSrc) && (
            <div className="flex justify-center">
              <img
                {...imgProps}
                className={`max-h-[150px] ${imgClassName}`}
                src={img?.src ?? placeholderSrc}
                alt={altText ?? 'placeholder image'}
              />
            </div>
          )}
          <Text preset={TEXT_PRESET.heading1} className="text-center">
            {title}
          </Text>
          {description}
          <OnboardingLayoutButton
            isActionDisabled={isActionDisabled}
            orderHref={orderHref}
            onOrderButtonClick={onOrderButtonClick}
            orderButtonLabel={orderButtonLabel}
            moreInfoHref={moreInfoHref}
            moreInfoButtonLabel={moreInfoButtonLabel}
            orderIam={orderIam}
            moreInfoButtonIcon={moreInfoButtonIcon}
            isMoreInfoButtonDisabled={isMoreInfoButtonDisabled}
          />
        </section>
      )}
      {children && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 xs:pt-10 sm:pt-20">
          {children}
        </div>
      )}
    </main>
  );
};

export default OnboardingLayout;
