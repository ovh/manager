import { OdsAccordion } from '@ovhcloud/ods-components/react';
import { useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const AccordionTest = () => {
  const [email, setEmail] = useState('');
  const [odsEmail, setOdsEmail] = useState('');
  return (
    <div>
      <h2>Accordion</h2>
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
            <TableCell>Simple accordion</TableCell>
            <TableCell>
              <Accordion type="single" collapsible>
                <AccordionItem value="acc1">
                  <AccordionTrigger>This is an accordion</AccordionTrigger>
                  <AccordionContent>
                    This is the content of the accordion item.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TableCell>
            <TableCell>
              <CheckCircle2 className="text-green-500" />
            </TableCell>
            <TableCell>
              <OdsAccordion>
                <span slot="summary">This is an accordion</span>
                <div>This is the content of the accordion item</div>
              </OdsAccordion>
            </TableCell>
            <TableCell>
              <CheckCircle2 className="text-green-500" />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Multiple accordion</TableCell>
            <TableCell>
              <Accordion type="single" collapsible>
                <AccordionItem value="acc1">
                  <AccordionTrigger>This is an accordion</AccordionTrigger>
                  <AccordionContent>
                    This is the content of the accordion item
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="acc2">
                  <AccordionTrigger>This is also an accordion</AccordionTrigger>
                  <AccordionContent>
                    This is the content of the second accordion item
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
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
            <TableCell>Custom with tailwind</TableCell>
            <TableCell>
              <Accordion className="bg-orange-800" type="single" collapsible>
                <AccordionItem value="acc1">
                  <AccordionTrigger className="text-blue-200">
                    This is an accordion
                  </AccordionTrigger>
                  <AccordionContent className="bg-orange-400">
                    This is the content of the accordion item
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TableCell>
            <TableCell>
              <CheckCircle2 className="text-green-500" />
            </TableCell>
            <TableCell>
              <OdsAccordion className="bg-orange-800">
                <span slot="summary" className="text-blue-200">
                  This is an accordion
                </span>
                <div className="bg-orange-400">
                  This is the content of the accordion item
                </div>
              </OdsAccordion>
            </TableCell>
            <TableCell>
              <XCircle className="text-red-500" />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Form in an accordion</TableCell>
            <TableCell>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input type="email" id="email" disabled value={email} />
                <Accordion type="single" collapsible>
                  <AccordionItem value="ap">
                    <AccordionTrigger className="text-base">
                      Advanced params
                    </AccordionTrigger>
                    <AccordionContent>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        type="email"
                        id="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </TableCell>
            <TableCell>
              <CheckCircle2 className="text-green-500" />
            </TableCell>
            <TableCell>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input type="email" id="email" disabled value={odsEmail} />
                <OdsAccordion>
                  <span slot="summary">Advanced params</span>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      type="email"
                      id="email"
                      placeholder="Email"
                      value={odsEmail}
                      onChange={(e) => setOdsEmail(e.target.value)}
                    />
                  </div>
                </OdsAccordion>
              </div>
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

export default AccordionTest;
