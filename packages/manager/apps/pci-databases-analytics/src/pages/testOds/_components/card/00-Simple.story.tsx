import { OdsCard } from '@ovhcloud/ods-components/react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { StoryResult } from '../Stories';

export default {
  story: 'Simple card',
  customComponentExemple: (
    <Card>
      <CardHeader>
        <CardTitle>This is a card header</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>This is the card content</CardContent>
      <CardFooter>This is the card footer</CardFooter>
    </Card>
  ),
  customComponentResult: StoryResult.success,
  ODSComponentExemple: (
    <OdsCard>
      <h3>This is a card header</h3>
      <p>This is a card description</p>
      <div>This is the card content</div>
      <div>This is the card footer</div>
    </OdsCard>
  ),
  ODSComponentResult: StoryResult.fail,
};
