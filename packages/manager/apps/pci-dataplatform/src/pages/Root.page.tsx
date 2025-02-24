import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  Button,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@datatr-ux/uxlib';
import * as databases from '@datatr-ux/ovhcloud-types/cloud/project/database/index';

export default function Root() {
  const myTopic: databases.kafka.Topic = {
    id: '123',
    retentionHours: 24,
    partitions: 3,
    minInsyncReplicas: 2,
    replication: 5,
    retentionBytes: 5,
    name: 'topic#1234',
  };

  return (
    <>
      <h1>h1 elem</h1>
      <h2>h2 elem</h2>
      <h3>h3 elem</h3>
      <p className="bg-orange-500">Hello world</p>
      <p className="text-primary-500">Hello world</p>
      <Button className="bg-success-500">Hello</Button>
      <Button>Test</Button>
      <Badge variant="promotion" className="bg-indigo-500">
        Mon badge {myTopic.name}
      </Badge>
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup className="text-text">
            <SelectLabel>Fruits</SelectLabel>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
            <SelectItem value="blueberry">Blueberry</SelectItem>
            <SelectItem value="grapes">Grapes</SelectItem>
            <SelectItem value="pineapple">Pineapple</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>Is it accessible?</AccordionTrigger>
          <AccordionContent>
            Yes. It adheres to the WAI-ARIA design pattern.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Is it styled?</AccordionTrigger>
          <AccordionContent>
            Yes. It comes with default styles that matches the other
            components&apos; aesthetic.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Is it animated?</AccordionTrigger>
          <AccordionContent>
            Yes. It's animated by default, but you can disable it if you prefer.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}
