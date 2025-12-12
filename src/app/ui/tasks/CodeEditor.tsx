'use client';

import React, { useState } from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  defaultValue?: string;
  language?: string;
  onChange?: (value: string | undefined) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ 
  defaultValue = '// Write your code here\n', 
  language = 'javascript',
  onChange 
}) => {
  const [code, setCode] = useState(defaultValue);

  const handleEditorChange = (value: string | undefined) => {
    setCode(value || '');
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <Editor
      height="100%"
      defaultLanguage={language}
      defaultValue={defaultValue}
      theme="vs-dark"
      loading={
        <div className="flex items-center justify-center h-full text-stone-500">
          Loading editor...
        </div>
      }
      onChange={handleEditorChange}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: 'on',
        roundedSelection: false,
        scrollBeyondLastLine: false,
        automaticLayout: true,
        padding: { top: 16, bottom: 16 },
        tabSize: 2,
        wordWrap: 'on',
        formatOnPaste: true,
        formatOnType: false,
        suggest: {
          showSnippets: true,
        },
        quickSuggestions: false,
      }}
    />
  );
};

export default CodeEditor;