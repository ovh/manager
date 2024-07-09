import { HashRouter, Routes, Route } from 'react-router-dom';

import './index.css';
import '@/vite-hmr.ts';
import { IndexPage } from '@/pages/Index/Index';
import { NewPage } from '@/pages/New.page';
import { ExecutionsPage } from '@/pages/Executions.page';

export const AppComponent = ({ baseName }: { baseName: string }) => (
  <HashRouter basename={baseName}>
    <Routes>
      <Route path=":projectId/workflow/new" element={<NewPage />} />
      <Route
        path=":projectId/workflow/:workflowId/executions"
        element={<ExecutionsPage />}
      />
      <Route path=":projectId/workflow/*" element={<IndexPage />} />
    </Routes>
  </HashRouter>
);
