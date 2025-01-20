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
import { Home } from 'lucide-react';
import { StoryResult } from '../Stories';

export default {
  story: 'Tailwind',
  customComponentExemple: (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/" className="text-green-500">
            <Home className="size-4" />
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>|</BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink href="/docs/components" className="text-blue-500">
            Parent
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>|</BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage className="text-red-500">Current</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
  customComponentResult: StoryResult.success,
  ODSComponentExemple: (
    <OdsBreadcrumb>
      <OdsBreadcrumbItem
        href="#"
        icon="home"
        className="text-green-500"
      ></OdsBreadcrumbItem>
      <OdsBreadcrumbItem
        href="#"
        label="Parent"
        className="text-blue-500"
      ></OdsBreadcrumbItem>
      <OdsBreadcrumbItem
        href="#"
        label="Current"
        className="text-red-500"
      ></OdsBreadcrumbItem>
    </OdsBreadcrumb>
  ),
  ODSComponentResult: StoryResult.fail,
};
