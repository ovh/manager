import { OdsBadge } from '@ovhcloud/ods-components/react';
import { CheckCircle2, Info, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const BadgeTest = () => {
  return (
    <div>
      <h2>Badge</h2>
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
            <TableCell>Simple badge</TableCell>
            <TableCell>
              <Badge>This is a badge</Badge>
            </TableCell>
            <TableCell>
              <CheckCircle2 className="text-green-500" />
            </TableCell>
            <TableCell>
              <OdsBadge label="this is an ODS badge" />
            </TableCell>
            <TableCell>
              <CheckCircle2 className="text-green-500" />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>With icon</TableCell>
            <TableCell>
              <Badge>
                <Info className="w-4 mr-2" />
                <span>This is a badge with an icon</span>
              </Badge>
            </TableCell>
            <TableCell>
              <CheckCircle2 className="text-green-500" />
            </TableCell>
            <TableCell>
              <OdsBadge label="this is an ODS badge" icon="circle-info" />
            </TableCell>
            <TableCell>
              <CheckCircle2 className="text-green-500" />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Custom tailwind</TableCell>
            <TableCell>
              <Badge className="text-orange-100 bg-green-200 hover:bg-green-400">
                This is a badge
              </Badge>
            </TableCell>
            <TableCell>
              <CheckCircle2 className="text-green-500" />
            </TableCell>
            <TableCell>
              <div className="grid">
                <OdsBadge
                  className="text-orange-100 bg-green-200 hover:bg-green-400"
                  label="this is an ODS badge"
                  icon="circle-info"
                />
              </div>
            </TableCell>
            <TableCell>
              <XCircle className="text-red-500" />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Complex badge</TableCell>
            <TableCell>
              <Badge>
                <div className="flex gap-2 items-center">
                  <Info />
                  <span>Badge with icon and badge</span>
                  <Badge variant="success">12</Badge>
                </div>
              </Badge>
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

export default BadgeTest;
