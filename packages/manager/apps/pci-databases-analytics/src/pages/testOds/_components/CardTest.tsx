import { OdsCard } from '@ovhcloud/ods-components/react';
import { CheckCircle2, XCircle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const CardTest = () => {
  return (
    <div>
      <h2>Card</h2>
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
            <TableCell>Simple card</TableCell>
            <TableCell>
              <Card>
                <CardHeader>
                  <CardTitle>This is a card header</CardTitle>
                  <CardDescription>Card Description</CardDescription>
                </CardHeader>
                <CardContent>This is the card content</CardContent>
                <CardFooter>This is the card footer</CardFooter>
              </Card>
            </TableCell>
            <TableCell>
              <CheckCircle2 className="text-green-500" />
            </TableCell>
            <TableCell>
              <OdsCard>
                <h3>This is a card header</h3>
                <p>This is a card description</p>
                <div>This is the card content</div>
                <div>This is the card footer</div>
              </OdsCard>
            </TableCell>
            <TableCell>
              <XCircle className="text-red-500" />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default CardTest;
