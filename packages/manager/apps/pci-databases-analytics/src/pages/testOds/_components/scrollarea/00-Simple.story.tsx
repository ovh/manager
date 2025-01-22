/* eslint-disable import/no-extraneous-dependencies */

import { Separator } from '@datatr-ux/uxlib';
import { ScrollArea } from '@/components/ui/scroll-area';
import { StoryResult } from '../Stories';

const tags = Array.from({ length: 50 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`,
);
export default {
  story: 'Simple scroll area',
  customComponentExemple: (
    <ScrollArea className="h-72 w-48 rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
        {tags.map((tag) => (
          <>
            <div key={tag} className="text-sm">
              {tag}
            </div>
            <Separator className="my-2" />
          </>
        ))}
      </div>
    </ScrollArea>
  ),
  customComponentResult: StoryResult.success,
  ODSComponentExemple: <span className="text-red-500">Not possible</span>,
  ODSComponentResult: StoryResult.fail,
};
