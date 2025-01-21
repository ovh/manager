import { CheckCircle2, XCircle } from 'lucide-react';
import { ReactElement } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export enum StoryResult {
  success,
  warning,
  fail,
}
export interface ComparisonStory {
  story: string;
  customComponentExemple: ReactElement | (() => JSX.Element);
  customComponentResult: StoryResult;
  ODSComponentExemple: ReactElement | (() => JSX.Element);
  ODSComponentResult: StoryResult;
}
interface CompareProps {
  componentName: string;
  stories: ComparisonStory[];
}

const Stories = ({ componentName, stories }: CompareProps) => {
  const calculateScore = (results: StoryResult[]) => {
    return results.reduce((total, result) => {
      if (result === StoryResult.success) return total + 1;
      if (result === StoryResult.warning) return total + 0.5;
      return total;
    }, 0);
  };

  const customScores = stories.map((story) => story.customComponentResult);
  const odsScores = stories.map((story) => story.ODSComponentResult);

  const customScore = calculateScore(customScores);
  const odsScore = calculateScore(odsScores);
  const resultElem = (result: StoryResult) => {
    switch (result) {
      case StoryResult.success:
        return <CheckCircle2 className="text-green-500" />;
      case StoryResult.warning:
        return <CheckCircle2 className="text-orange-500" />;
      default:
        return <XCircle className="text-red-500" />;
    }
  };

  const renderComponent = (
    component: ReactElement | (() => JSX.Element),
  ): ReactElement => {
    if (typeof component === 'function') {
      return <>{component()}</>; // Call and render the function
    }
    return component; // Render the element directly
  };

  return (
    <div>
      <h2>{componentName}</h2>
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
          {stories.map((s) => (
            <TableRow>
              <TableCell>{s.story}</TableCell>
              <TableCell>{renderComponent(s.customComponentExemple)}</TableCell>
              <TableCell>{resultElem(s.customComponentResult)}</TableCell>
              <TableCell>{renderComponent(s.ODSComponentExemple)}</TableCell>
              <TableCell>{resultElem(s.ODSComponentResult)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        {/* <TableFooter>
          <TableRow>
            <TableCell colSpan={2} className="font-bold">
              Scores
            </TableCell>
            <TableCell colSpan={2} className="font-bold">
              Custom: {customScore}
            </TableCell>
            <TableCell colSpan={2} className="font-bold">
              Ods: {odsScore}
            </TableCell>
          </TableRow>
        </TableFooter> */}
      </Table>
    </div>
  );
};

export default Stories;
