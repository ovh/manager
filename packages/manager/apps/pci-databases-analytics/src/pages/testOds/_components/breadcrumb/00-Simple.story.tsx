/* eslint-disable import/no-extraneous-dependencies */
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  DropdownMenu,
  DropdownMenuTrigger,
  BreadcrumbEllipsis,
  DropdownMenuContent,
  DropdownMenuItem,
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
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>|</BreadcrumbSeparator>
        <BreadcrumbItem>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1">
              <BreadcrumbEllipsis className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>Documentation</DropdownMenuItem>
              <DropdownMenuItem>Themes</DropdownMenuItem>
              <DropdownMenuItem>GitHub</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </BreadcrumbItem>
        <BreadcrumbSeparator>|</BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink href="/docs/components">Components</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>|</BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
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
