/* eslint-disable import/no-extraneous-dependencies */
import { Home } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@datatr-ux/uxlib';
import {
  OdsBreadcrumb,
  OdsBreadcrumbItem,
} from '@ovhcloud/ods-components/react';
import { StoryResult } from '../Stories';

export default {
  story: 'Simple breadcrumb',
  customComponentExemple: (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">
            <Home className="size-4" />
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>|</BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink href="/docs/components">Parent</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>|</BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage>Current</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
  customComponentResult: StoryResult.success,
  ODSComponentExemple: (
    <OdsBreadcrumb>
      <OdsBreadcrumbItem href="#" icon="home"></OdsBreadcrumbItem>
      <OdsBreadcrumbItem href="#" label="Parent"></OdsBreadcrumbItem>
      <OdsBreadcrumbItem href="#" label="Current"></OdsBreadcrumbItem>
    </OdsBreadcrumb>
  ),
  ODSComponentResult: StoryResult.warning,
};
