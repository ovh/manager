import React, {
  ComponentProps,
  PropsWithChildren,
  ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { OsdsDivider, OsdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_TEXT_COLOR_HUE,
  ODS_TEXT_COLOR_INTENT,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import clsx from 'clsx';
import { CheckboxControl } from '@/components/internal/checkbox/Checkbox';
import { Badge, BadgeProps } from '../internal/badge/Badge';
import { RadioControl } from '@/components/internal/radio/Radio';
import './style.scss';

const Text = ({
  children,
  className,
  ...otherProps
}: PropsWithChildren<
  Omit<ComponentProps<typeof OsdsText>, 'color' | 'size'>
>) => (
  <OsdsText
    color={ODS_TEXT_COLOR_INTENT.text}
    size={ODS_TEXT_SIZE._100}
    className={clsx(className, 'text-[14px] leading-[100%]')}
    {...otherProps}
  >
    {children}
  </OsdsText>
);

const SmallText = ({
  children,
  className,
  ...otherProps
}: PropsWithChildren<
  Omit<ComponentProps<typeof OsdsText>, 'color' | 'size'>
>) => (
  <OsdsText
    color={ODS_TEXT_COLOR_INTENT.text}
    size={ODS_TEXT_SIZE._100}
    className={clsx(className, 'text-[12px] leading-[100%]')}
    {...otherProps}
  >
    {children}
  </OsdsText>
);

const Root = ({ children }: PropsWithChildren) => (
  <div className="config-card">{children}</div>
);

const Header = ({ children }: PropsWithChildren) => (
  <div className="config-card__header">{children}</div>
);

const Title = ({ children, ...divProps }: ComponentProps<'div'>) => (
  <div {...divProps}>
    <OsdsText
      color={ODS_TEXT_COLOR_INTENT.primary}
      level={ODS_TEXT_LEVEL.heading}
      size={ODS_TEXT_SIZE._300}
      hue={ODS_TEXT_COLOR_HUE._800}
    >
      {children}
    </OsdsText>
  </div>
);

const Body = ({ children, className, ...divProps }: ComponentProps<'div'>) => (
  <div className={clsx(className, 'config-card__body')} {...divProps}>
    {children}
  </div>
);
const BodySection = ({ children }: PropsWithChildren) => (
  <div className="config-card__body-section">{children}</div>
);

const Description = ({ children }: PropsWithChildren) => (
  <Text>{children}</Text>
);

const Footer = ({ children }: PropsWithChildren) => (
  <div className="config-card__footer">{children}</div>
);

interface Price {
  value: string; // value formatted with currency (e.g.: 25,50 €)
  unit: string; // needs to include VAT/non-VAT (e.g.: HT/mois)
  isLeastPrice?: boolean;
  descriptions?: string[];
}

const PriceFrom = () => (
  <div>
    <OsdsText
      color={ODS_TEXT_COLOR_INTENT.text}
      size={ODS_TEXT_SIZE._100}
      className="text-[12px] leading-[100%] font-bold"
    >
      À partir de
    </OsdsText>
  </div>
);

const Price = ({ value, unit }: Pick<Price, 'value' | 'unit'>) => (
  <div>
    <OsdsText
      color={ODS_TEXT_COLOR_INTENT.primary}
      level={ODS_TEXT_LEVEL.heading}
      size={ODS_TEXT_SIZE._400}
      className="leading-[100%]"
    >
      {value}
    </OsdsText>

    <SmallText className="ml-2">{unit}</SmallText>
  </div>
);

const PriceDescriptions = ({ descriptions }: { descriptions: string[] }) => (
  <div>
    {descriptions.map((d) => (
      <div key={d} className="leading-[100%]">
        <SmallText>{d}</SmallText>
      </div>
    ))}
  </div>
);

const Features = ({ features }: { features: string[] }) => (
  <ul className="list-['✓'] marker:text-[#2B8000] pl-6 mb-0">
    {features.map((f) => (
      <li key={f} className="pl-5">
        <Text>{f}</Text>
      </li>
    ))}
  </ul>
);

const Badges = ({ badges }: { badges: BadgeProps[] }) => (
  <div className="inline-flex gap-4 flex-wrap">
    {badges.map((b) => (
      <Badge key={b.label} size={b.size ?? 'sm'} {...b} />
    ))}
  </div>
);

export interface ConfigCardElementProps {
  label: string;
  badges?: BadgeProps[];
  description?: string;
  features?: string[];
  // ReactNode is deprecated
  price?: Price | ReactNode;
}

export interface ConfigCardProps extends ConfigCardElementProps {
  // Accessibility
  labelId?: string;
  ariaDetailsId?: string;
  inputProps: ComponentProps<'input'>;
}

export const ConfigCard = ({
  label,
  badges,
  description,
  features,
  price,
  labelId,
  ariaDetailsId,
  inputProps,
}: ConfigCardProps) => {
  const sections: ReactNode[] = [];

  sections.push(<Description>{description}</Description>);

  if (features) sections.push(<Features features={features} />);

  let input: ReactNode = null;
  if (inputProps.type === 'checkbox') {
    input = <CheckboxControl {...inputProps} />;
  } else if (inputProps.type === 'radio') {
    input = <RadioControl {...inputProps} />;
  } else {
    input = <input {...inputProps} />;
  }

  return (
    <label>
      <Root>
        <Header>
          <div className="flex flex-col gap-[8px]">
            <div className="inline-flex items-center gap-4 mb-2">
              {input}
              <Title id={labelId}>{label}</Title>
            </div>

            {!!badges && badges.length > 0 && <Badges badges={badges} />}
          </div>
        </Header>

        <Body id={ariaDetailsId}>
          {sections.map((section, i) => (
            <div key={i}>
              {i !== 0 && <OsdsDivider separator />}
              <BodySection>{section}</BodySection>
            </div>
          ))}
        </Body>

        {!!price && typeof price === 'object' && 'value' in price && (
          <Footer>
            {price.isLeastPrice && <PriceFrom />}

            <Price value={price.value} unit={price.unit} />

            {!!price.descriptions && price.descriptions.length > 0 && (
              <PriceDescriptions descriptions={price.descriptions} />
            )}
          </Footer>
        )}

        {/* Deprecated, use price object */}
        {!!price && React.isValidElement(price) && <Footer>{price}</Footer>}
      </Root>
    </label>
  );
};
