/* eslint-disable import/no-extraneous-dependencies */
import { OdsTable } from '@ovhcloud/ods-components/react';
import { StoryResult } from '../Stories';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default {
  story: 'Tailwind',
  customComponentExemple: (
    <Table className="border border-neutral-200">
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader className="bg-blue-50">
        <TableRow>
          <TableHead className="min-h-12 w-[100px] border border-blue-200 text-primary-800 font-semibold px-4 py-3 bg-blue-100">
            Invoice
          </TableHead>
          <TableHead className="border border-blue-200 text-primary-800 font-semibold px-4 py-2 bg-blue-100">
            Status
          </TableHead>
          <TableHead className="border border-blue-200 text-primary-800 font-semibold px-4 py-2 bg-blue-100">
            Method
          </TableHead>
          <TableHead className="border border-blue-200 text-primary-800 font-semibold px-4 py-2 bg-blue-100">
            Amount
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="bg-white">
        <TableRow className="min-h-12">
          <TableCell className="py-3 min-h-12 font-medium">INV001</TableCell>
          <TableCell>Paid</TableCell>
          <TableCell>Credit Card</TableCell>
          <TableCell className="text-right">$250.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="py-3 min-h-12 font-medium">INV002</TableCell>
          <TableCell>Paid</TableCell>
          <TableCell>Credit Card</TableCell>
          <TableCell className="text-right">$350.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="py-3 min-h-12 font-medium">INV003</TableCell>
          <TableCell>Paid</TableCell>
          <TableCell>Credit Card</TableCell>
          <TableCell className="text-right">$50.00</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
  customComponentResult: StoryResult.success,
  ODSComponentExemple: (
    <OdsTable>
      <table>
        <caption>A list of your recent invoices.</caption>
        <thead className='bg-blue-50'>
          <tr>
            <th className="bg-blue-100 border-blue-200 w-[100px]">Invoice</th>
            <th>Status</th>
            <th>Method</th>
            <th className="text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="font-medium">INV001</td>
            <td>Paid</td>
            <td>Credit Card</td>
            <td className="text-right">$250.00</td>
          </tr>
          <tr>
            <td className="font-medium">INV002</td>
            <td>Paid</td>
            <td>Credit Card</td>
            <td className="text-right">$350.00</td>
          </tr>
          <tr>
            <td className="font-medium">INV003</td>
            <td>Paid</td>
            <td>Credit Card</td>
            <td className="text-right">$50.00</td>
          </tr>
        </tbody>
      </table>
    </OdsTable>
  ),
  ODSComponentResult: StoryResult.fail,
};
