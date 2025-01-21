import { OdsCode } from '@ovhcloud/ods-components/react';
import { StoryResult } from '../Stories';
import CodeBlock from './code';

const sampleCode = `function add(a: number, b: number): number {
  return a + b;
}

console.log(add(2, 3));`;

export default {
  story: 'Copy button',
  customComponentExemple: (
    <CodeBlock code={sampleCode} language="typescript" showCopyButton={true} />
  ),
  customComponentResult: StoryResult.success,
  ODSComponentExemple: <OdsCode canCopy>{sampleCode}</OdsCode>,
  ODSComponentResult: StoryResult.warning,
};
