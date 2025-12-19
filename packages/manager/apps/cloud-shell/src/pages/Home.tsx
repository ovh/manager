import { odsSetup } from '@ovhcloud/ods-common-core';
import '@ovhcloud/ods-theme-blue-jeans';

import React, { useContext, useEffect, useState } from 'react';
import { ReactTerminal, TerminalContext } from 'react-terminal';
import { useTranslation } from 'react-i18next';
import { convert } from '@catalystic/json-to-yaml';
import { makeBlockFactory } from '@json-table/core/json-to-table';
import {
  ASCIITableFormat,
  blockToASCII,
} from '@json-table/core/block-to-ascii';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import '../wasm_exec.js';

odsSetup();

const CLOUD_SHELL_HISTORY = 'ovhcloud-shell-history';
const HISTORY_SIZE = 200;

const loadWasm = async (): Promise<void> => {
  const goWasm = new window.Go();
  goWasm.env = {
    OVH_ENDPOINT: `${window.location.protocol}//${window.location.host}/engine/api`,
    OVH_USER_AGENT: navigator.userAgent,
  };
  const { instance } = await WebAssembly.instantiateStreaming(
    fetch('ovhcloud.wasm'),
    goWasm.importObject,
  );

  goWasm.run(instance);
};

const App: React.FC = () => {
  const { t } = useTranslation();
  const [error, setError] = useState<Error>();
  const { setTemporaryContent, appendCommandToHistory } = useContext(
    TerminalContext,
  );
  const [isWasmLoaded, setIsWasmLoaded] = useState<boolean>(false);
  const [theme, setTheme] = useState<string>('material-dark');
  const [history, setHistory] = useState<string[]>([]);

  const welcomeMessage = (
    <pre className="text-sm">{t('cloud_shell_welcome')}</pre>
  );

  const commands = {
    whoami: 'OVHcloud',
    history: () => (
      <ol>
        {history.map((c, i) => (
          <li key={i}>{c}</li>
        ))}
      </ol>
    ),
  };

  const createBlock = makeBlockFactory({
    cornerCellValue: '',
    joinPrimitiveArrayValues: true,
  });

  const toggleTheme = () => {
    setTheme((prev: string) =>
      prev === 'material-dark' ? 'material-light' : 'material-dark',
    );
  };

  const handleTerminalInput = async (
    command: string,
    args: string,
  ): Promise<JSX.Element | string> => {
    const cmd = command === 'ovhcloud' ? '' : command;
    const cmdArgs: Array<string> = args.split(/\s/);
    const cliArgs: string = cmdArgs.join(' ');

    try {
      setTemporaryContent(t('cloud_shell_waiting'));
      const response = await window.exec(`${cmd} ${cliArgs}`);
      const data = await response.json();

      setHistory((h) => {
        const newHistory = [...h, `${cmd} ${cliArgs}`];
        if (newHistory.length >= HISTORY_SIZE) {
          newHistory.shift();
        }

        return newHistory;
      });

      if (cmdArgs.includes('--json')) {
        const str: string = JSON.stringify(data, null, 2);
        return (
          <SyntaxHighlighter
            language="json"
            style={a11yDark}
            wrapLines
            showLineNumbers={false}
          >
            {str}
          </SyntaxHighlighter>
        );
      }

      if (cmdArgs.includes('--yaml')) {
        const yaml: string = convert(data);
        return (
          <SyntaxHighlighter
            language="yaml"
            style={a11yDark}
            wrapLines
            showLineNumbers={false}
          >
            {yaml}
          </SyntaxHighlighter>
        );
      }

      const block = createBlock(data);
      const retAscii: string = blockToASCII(block, {
        format: ASCIITableFormat.MySQL,
      });

      return <pre style={{ fontSize: '.9rem' }}>{retAscii}</pre>;
    } catch (err) {
      return err.message;
    }
  };

  const loadHistory = () => {
    const storedCmds = localStorage.getItem(CLOUD_SHELL_HISTORY);
    if (!storedCmds) {
      return;
    }

    const cmds = JSON.parse(storedCmds);
    if (Array.isArray(cmds)) {
      setHistory(cmds);
      appendCommandToHistory((cmds as unknown) as string);
    }
  };

  useEffect(() => {
    loadWasm()
      .then(() => {
        setIsWasmLoaded(true);
        loadHistory();
      })
      .catch(setError);
  }, []);

  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem(CLOUD_SHELL_HISTORY, JSON.stringify(history));
    }
  }, [history]);

  if (error) {
    throw error;
  }

  return (
    <>
      <button
        onClick={toggleTheme}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          padding: '10px 15px',
          borderRadius: '20px',
          border: 'none',
          backgroundColor: '#333',
          color: '#fff',
          cursor: 'pointer',
          zIndex: 1000,
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        }}
      >
        {theme === 'material-dark'
          ? t('cloud_shell_switch_theme_light')
          : t('cloud_shell_switch_theme_dark')}
      </button>
      {isWasmLoaded ? (
        <ReactTerminal
          commands={commands}
          theme={theme}
          welcomeMessage={welcomeMessage}
          defaultHandler={handleTerminalInput}
          showControlBar={false}
        />
      ) : (
        <div>{t('cloud_shell_loading_environment')}</div>
      )}
    </>
  );
};

export default App;
