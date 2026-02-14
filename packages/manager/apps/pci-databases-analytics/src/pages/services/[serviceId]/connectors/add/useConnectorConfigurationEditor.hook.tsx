import * as monaco from 'monaco-editor';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as database from '@/types/cloud/project/database';

const FALLBACKS: Record<
  database.kafkaConnect.capabilities.connector.configuration.Property['type'],
  string
> = {
  boolean: 'false',
  list: '""',
  int32: '0',
  int64: '0',
  string: '""',
  password: '""',
  class: '""',
  double: '0.0',
  int16: '0',
  transform: '""',
};

function formatInsertText(
  property: database.kafkaConnect.capabilities.connector.configuration.Property,
): string {
  const { name, type, defaultValue } = property;
  let value = defaultValue;

  if (value === null || value === '[hidden]') {
    value = FALLBACKS[type] ?? 'null';
  } else {
    switch (type) {
      case 'string':
      case 'password':
      case 'class':
        value = JSON.stringify(value);
        break;
      case 'boolean':
        value = value === 'true' ? 'true' : 'false';
        break;
      case 'int32':
      case 'int64':
        value = parseInt(value, 10).toString();
        break;
      default:
        value =
          typeof value === 'string' ? JSON.stringify(value) : String(value);
    }
  }

  return `"${name}": ${value}`;
}

let currentCompletionProvider: monaco.IDisposable | null = null;
let currentHoverProvider: monaco.IDisposable | null = null;

export function useConnectorConfigurationEditor(
  connectorConfiguration: database.kafkaConnect.capabilities.connector.configuration.Property[],
) {
  const [editorKey, setEditorKey] = useState(0);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const getDefaultConfig = (
    properties: database.kafkaConnect.capabilities.connector.configuration.Property[],
  ) => {
    const uniqueItems = Array.from(
      new Set(properties.map((item) => JSON.stringify(item))),
    ).map((item) => JSON.parse(item));
    return (
      [...uniqueItems]
        .sort((a, b) => a.name.localeCompare(b.name))
        // .filter((a) => a.required)
        .reduce<Record<string, unknown>>((acc, property) => {
          const { name, type, required, defaultValue } = property;
          const hasDefault =
            defaultValue !== null && defaultValue !== '[hidden]';

          let value: unknown = '';

          if (hasDefault) {
            switch (type) {
              case 'boolean':
                value = defaultValue === 'true';
                break;
              case 'int32':
              case 'int64':
                value = parseInt(defaultValue, 10);
                break;
              default:
                value = defaultValue;
            }
          } else if (required) {
            value = '';
          }

          if (hasDefault || required) {
            acc[name] = value;
          }

          return acc;
        }, {})
    );
  };

  const initializeEditorCompletion = (
    monacoInstance: typeof monaco,
    properties: database.kafkaConnect.capabilities.connector.configuration.Property[],
  ) => {
    const uniqueItems = Array.from(
      new Set(properties.map((item) => JSON.stringify(item))),
    ).map((item) => JSON.parse(item));
    currentCompletionProvider?.dispose();
    currentHoverProvider?.dispose();

    currentCompletionProvider = monacoInstance.languages.registerCompletionItemProvider(
      'json',
      {
        provideCompletionItems: (model, position) => {
          const word = model.getWordUntilPosition(position);
          const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn,
          };

          const suggestions = uniqueItems.map((property) => ({
            label: property.name,
            kind: monacoInstance.languages.CompletionItemKind.Property,
            documentation: property.description,
            insertText: formatInsertText(property),
            insertTextRules:
              monacoInstance.languages.CompletionItemInsertTextRule
                .InsertAsSnippet,
            range,
          }));

          return { suggestions };
        },
      },
    );

    currentHoverProvider = monacoInstance.languages.registerHoverProvider(
      'json',
      {
        provideHover: (model, position) => {
          const word = model.getWordAtPosition(position);
          if (!word) return null;

          const match = uniqueItems.find((p) => p.name === word.word);
          if (!match) return null;

          return {
            contents: [
              { value: `**${match.displayName || match.name}**` },
              { value: match.description },
            ],
          };
        },
      },
    );

    return [currentCompletionProvider, currentHoverProvider];
  };

  useEffect(() => {
    setEditorKey((prev) => prev + 1);
  }, [connectorConfiguration]);

  const initialValue = useMemo(
    () =>
      JSON.stringify(
        getDefaultConfig(
          connectorConfiguration.filter((c) => c.name !== 'name'),
        ),
        null,
        2,
      ),
    [connectorConfiguration],
  );

  // dispose editor on unmount
  useEffect(() => {
    return () => {
      currentCompletionProvider?.dispose();
      currentHoverProvider?.dispose();
      editorRef.current?.dispose();
    };
  }, []);

  return {
    editorRef,
    editorKey,
    initialValue,
    initializeEditorCompletion,
  };
}
