import { ComponentPropsWithRef, ElementType, ReactNode } from 'react';

import { LinkProp as OdsLinkProp } from '@ovhcloud/ods-react';

export enum LinkType {
  back = 'back',
  next = 'next',
  external = 'external',
  survey = 'survey',
}

interface CustomLinkProps {
  // Customization props
  type?: LinkType;
  // IAM trigger props
  iamActions?: string[];
  urn?: string;
  displayTooltip?: boolean;
  disableIamCheck?: boolean;
  surveyLink?: SurveyLinkQueryParams & {
    applicationKey: string;
  };
}

export type LinkProps<T extends ElementType = 'a'> = CustomLinkProps &
  OdsLinkProp<T> &
  Omit<ComponentPropsWithRef<T>, keyof OdsLinkProp<T> | keyof CustomLinkProps>;

// Util props types
export type SurveyLinkQueryParams = {
  email: string;
  nichandle?: string;
  productId?: string;
};
export type GenerateSurveyLinkProps = {
  applicationKey: string;
  languageCode?: string;
  queryParams: SurveyLinkQueryParams;
};

// Icon props types
type BackLinkProps = { type?: LinkType.back; children: ReactNode };
type ExternalLinkProps = { type?: LinkType.external; children: ReactNode };
type NextLinkProps = { type?: LinkType.next; children: ReactNode };
type SurveyLinkProps = { type?: LinkType.survey; children: ReactNode };

export type LinkIconsProps = BackLinkProps | ExternalLinkProps | NextLinkProps | SurveyLinkProps;
