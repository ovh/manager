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
import { CheckCircle2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const BreadcrumbTest = () => {
  return (
    <div>
      <h2>Breadcrumb</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Story</TableHead>
            <TableHead>Custom</TableHead>
            <TableHead>Result</TableHead>
            <TableHead>ODS</TableHead>
            <TableHead>Result</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Simple breadcrumb</TableCell>
            <TableCell>
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
                    <BreadcrumbLink href="/docs/components">
                      Components
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator>|</BreadcrumbSeparator>
                  <BreadcrumbItem>
                    <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </TableCell>
            <TableCell>
              <CheckCircle2 className="text-green-500" />
            </TableCell>
            <TableCell>
              <OdsBreadcrumb>
                <OdsBreadcrumbItem href="#" icon="home"></OdsBreadcrumbItem>
                <OdsBreadcrumbItem href="#" label="Parent"></OdsBreadcrumbItem>
                <OdsBreadcrumbItem href="#" label="Current"></OdsBreadcrumbItem>
              </OdsBreadcrumb>
            </TableCell>
            <TableCell>
              <CheckCircle2 className="text-orange-500" />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default BreadcrumbTest;
