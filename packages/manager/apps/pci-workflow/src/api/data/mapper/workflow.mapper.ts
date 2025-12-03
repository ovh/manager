import { addMinutes, format, parseISO } from 'date-fns';
import * as dateFnsLocales from 'date-fns/locale';

import { TRemoteWorkflow } from '@/api/data/region-workflow';
import { TWorkflowLastExecution } from '@/api/hooks/workflows';

export const addLastExecution =
  (userLocale: string) =>
  <T extends TRemoteWorkflow>(w: T): T & TWorkflowLastExecution => {
    if (!w.executions || !Array.isArray(w.executions) || w.executions.length === 0) {
      return {
        ...w,
        lastExecution: '',
        lastExecutionStatus: undefined,
      };
    }

    const executions = w.executions
      .map((execution) => ({
        at: parseISO(execution.executedAt),
        ...execution,
      }))
      .sort((a, b) => b.at.getTime() - a.at.getTime());

    const lastExecutionAt = executions[0].at;
    const lastExecutionStatus = executions[0].state;

    return {
      ...w,
      lastExecution: format(
        addMinutes(lastExecutionAt, lastExecutionAt.getTimezoneOffset()),
        'dd MMM yyyy HH:mm:ss',
        {
          locale: dateFnsLocales[userLocale as keyof typeof dateFnsLocales],
        },
      ),
      lastExecutionStatus,
    };
  };
