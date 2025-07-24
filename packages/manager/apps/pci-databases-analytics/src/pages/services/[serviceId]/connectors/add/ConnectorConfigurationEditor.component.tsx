import { Editor } from '@monaco-editor/react';
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import { editor as monaco } from 'monaco-editor';
import { Skeleton } from '@datatr-ux/uxlib';
import * as database from '@/types/cloud/project/database';
import { cn } from '@/lib/utils';
import { useConnectorConfigurationEditor } from './useConnectorConfigurationEditor';

interface ConnectorConfigurationEditorProps {
  connectorCapabilities: database.kafkaConnect.capabilities.connector.configuration.Property[];
  className?: string;
  initialValue?: { [key: string]: string };
}

const ConnectorConfigurationEditor = forwardRef<
  {
    getValue: () => string | undefined;
    resetValue: () => void;
  },
  ConnectorConfigurationEditorProps
>(
  (
    { connectorCapabilities, className = '', initialValue: currentConfig },
    ref,
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const {
      editorRef,
      editorKey,
      initialValue,
      initializeEditorCompletion,
    } = useConnectorConfigurationEditor(connectorCapabilities);

    const defaultValue = currentConfig
      ? JSON.stringify(currentConfig, null, 2)
      : initialValue;

    const resetValue = useCallback(() => {
      const editor = editorRef.current;
      if (editor) {
        editor.setValue(defaultValue);
      }
    }, [defaultValue]);

    useImperativeHandle(ref, () => ({
      getValue: () => editorRef.current?.getValue(),
      resetValue,
    }));

    // Handle editor resize
    useEffect(() => {
      const handleResize = () => {
        if (editorRef.current) {
          editorRef.current.layout({} as monaco.IDimension);
        }
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
      <div ref={containerRef} className={cn('h-[60vh] w-full', className)}>
        <Editor
          options={{ automaticLayout: true }}
          key={editorKey}
          className="h-full w-full"
          loading={<Skeleton className="h-full w-full" />}
          defaultLanguage="json"
          defaultValue={defaultValue}
          theme="vs-dark"
          onMount={(editor, monacoInstance) => {
            editorRef.current = editor;

            // add reset button
            const resetWidget = {
              getId: () => 'reset.button',
              getDomNode: () => {
                const btn = document.createElement('button');
                btn.textContent = 'Reset';
                btn.type = 'button';
                btn.className =
                  'px-2 py-1 bg-yellow-600 text-black text-sm rounded-b shadow';
                btn.onclick = () => resetValue();
                return btn;
              },
              getPosition: () => ({
                preference:
                  monacoInstance.editor.OverlayWidgetPositionPreference
                    .TOP_RIGHT_CORNER,
              }),
            };

            editor.addOverlayWidget(resetWidget);

            initializeEditorCompletion(monacoInstance, connectorCapabilities);
          }}
        />
      </div>
    );
  },
);

export default ConnectorConfigurationEditor;
