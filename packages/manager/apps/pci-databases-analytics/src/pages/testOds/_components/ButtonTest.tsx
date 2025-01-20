import { OdsButton } from '@ovhcloud/ods-components/react';
import { CheckCircle2, Info, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from '@/components/links/Link.component';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const ButtonTest = () => {
  return (
    <div>
      <h2>Button</h2>
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
            <TableCell>Simple button</TableCell>
            <TableCell>
              <Button>This is a button</Button>
            </TableCell>
            <TableCell>
              <CheckCircle2 className="text-green-500" />
            </TableCell>
            <TableCell>
              <OdsButton label="this is an ODS button" />
            </TableCell>
            <TableCell>
              <CheckCircle2 className="text-green-500" />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>With icon</TableCell>
            <TableCell>
              <Button>
                <Info className="w-4 mr-2" />
                <span>This is a button with an icon</span>
              </Button>
            </TableCell>
            <TableCell>
              <CheckCircle2 className="text-green-500" />
            </TableCell>
            <TableCell>
              <OdsButton label="this is an ODS button" icon="circle-info" />
            </TableCell>
            <TableCell>
              <CheckCircle2 className="text-green-500" />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Custom tailwind</TableCell>
            <TableCell>
              <Button className="text-orange-100 bg-green-200 hover:bg-green-400">
                This is a button
              </Button>
            </TableCell>
            <TableCell>
              <CheckCircle2 className="text-green-500" />
            </TableCell>
            <TableCell>
              <div className="grid">
                <OdsButton
                  label="this is an ODS button"
                  className="text-orange-100 bg-green-200 hover:bg-green-400"
                />
              </div>
            </TableCell>
            <TableCell>
              <XCircle className="text-red-500" />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Button acting like a link</TableCell>
            <TableCell>
              <Button asChild>
                <Link
                  to=""
                  className="hover:no-underline hover:text-primary-foreground"
                >
                  This is a button acting like a link
                </Link>
              </Button>
            </TableCell>
            <TableCell>
              <CheckCircle2 className="text-green-500" />
            </TableCell>
            <TableCell>
              <span className="text-red-500">Not possible</span>
            </TableCell>
            <TableCell>
              <XCircle className="text-red-500" />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Complex button</TableCell>
            <TableCell>
              <Button>
                <div className="flex gap-2">
                  <Info />
                  <span>Button with icon and badge</span>
                  <Badge variant="success">12</Badge>
                </div>
              </Button>
            </TableCell>
            <TableCell>
              <CheckCircle2 className="text-green-500" />
            </TableCell>
            <TableCell>
              <span className="text-red-500">Not possible</span>
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

export default ButtonTest;
