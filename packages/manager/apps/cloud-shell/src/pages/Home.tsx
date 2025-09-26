import { odsSetup } from '@ovhcloud/ods-common-core';
import '@ovhcloud/ods-theme-blue-jeans';

import React, { useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
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
  const { setTemporaryContent } = useContext(TerminalContext);
  const [isWasmLoaded, setIsWasmLoaded] = useState<boolean>(false);
  const [theme, setTheme] = useState<string>('material-dark');
  const [searchParams] = useSearchParams();

  const welcomeMessage = <p>{t('cloud_shell_welcome')}</p>;
  const commands = {
    whoami: 'OVHcloud',
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
    const cmdArgs: Array<string> = args.split(/\s/);
    const cliArgs: string = cmdArgs.join(' ');

    try {
      setTemporaryContent(t('cloud_shell_waiting'));
      const response = await window.exec(`${command} ${cliArgs}`);
      const data = await response.json();

      if (data.help) {
        data.help = data.help.replace(
          /\bovhcloud(?:\s+(\w+))?\s+(\[.*?\])/g,
          (_, cmdHelp: string | undefined, cmdStr: string): string =>
            (cmdHelp ? `${cmdHelp} ` : '') + cmdStr,
        );
      }

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

  const handleCmdParams = () => {
    const cmdParam = searchParams.get('cmd');
    if (cmdParam) {
      setTemporaryContent(`${t('cloud_shell_running_command')}: ${cmdParam}`);
      handleTerminalInput(cmdParam, '');
    } else {
      setTemporaryContent('');
    }
  };

  useEffect(() => {
    loadWasm()
      .then(() => {
        setIsWasmLoaded(true);
        handleCmdParams();
      })
      .catch(setError);
  }, []);

  useEffect(() => {
    if (!isWasmLoaded) {
      return;
    }

    handleCmdParams();
  }, [searchParams]);

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
