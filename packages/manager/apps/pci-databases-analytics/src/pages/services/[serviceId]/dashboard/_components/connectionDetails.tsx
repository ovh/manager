import { useState } from 'react';
import { Files } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { database } from '@/models/database';
import { useToast } from '@/components/ui/use-toast';

interface ConnectionDetailsProps {
  endpoints: database.service.Endpoint[];
}

const ConnectionDetails = ({ endpoints }: ConnectionDetailsProps) => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<
    database.service.Endpoint
  >(endpoints[0]);
  const toast = useToast();
  return (
    <>
      <div>
        {endpoints.length > 1 && (
          <Select
            value={selectedEndpoint.component}
            onValueChange={(v) =>
              setSelectedEndpoint(
                endpoints.find((endpoint) => endpoint.component === v),
              )
            }
          >
            <SelectTrigger className="h-8 mb-3">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {endpoints.map((ep) => (
                <SelectItem key={ep.component} value={ep.component}>
                  {ep.component}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <Table>
          <TableBody>
            {selectedEndpoint?.domain && (
              <TableRow>
                <TableCell className="font-semibold">Hote</TableCell>
                <TableCell>
                  <div className="flex justify-center h-6 max-w-[345px]">
                    <p className="flex-1 truncate">{selectedEndpoint.domain}</p>
                    <Button
                      type="button"
                      size="table"
                      variant="ghost"
                      className="ml-2 hover:bg-primary-100 hover:text-primary-700 hover:font-semibold"
                      onClick={() => {
                        navigator.clipboard.writeText(selectedEndpoint.domain);
                        toast.toast({
                          title: 'copied',
                        });
                      }}
                    >
                      <Files className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {selectedEndpoint?.port && (
              <TableRow>
                <TableCell className="font-semibold">Port</TableCell>
                <TableCell>{selectedEndpoint.port}</TableCell>
              </TableRow>
            )}
            {selectedEndpoint?.scheme && (
              <TableRow>
                <TableCell className="font-semibold">Protocole</TableCell>
                <TableCell>{selectedEndpoint.scheme}</TableCell>
              </TableRow>
            )}
            {selectedEndpoint?.sslMode && (
              <TableRow>
                <TableCell className="font-semibold">SSL Mode</TableCell>
                <TableCell>Required</TableCell>
              </TableRow>
            )}
            {selectedEndpoint?.uri && (
              <TableRow>
                <TableCell className="font-semibold">URI</TableCell>
                <TableCell>
                  <div className="flex justify-center h-6 max-w-[345px]">
                    <p className="flex-1 truncate">{selectedEndpoint.uri}</p>
                    <Button
                      type="button"
                      size="table"
                      variant="ghost"
                      className="ml-2 hover:bg-primary-100 hover:text-primary-700 hover:font-semibold"
                      onClick={() => {
                        navigator.clipboard.writeText(selectedEndpoint.uri);
                        toast.toast({
                          title: 'copied',
                        });
                      }}
                    >
                      <Files className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default ConnectionDetails;
