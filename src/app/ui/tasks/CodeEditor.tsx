'use client';

import React, { useState } from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  defaultValue?: string;
  language?: string;
  onChange?: (value: string | undefined) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  defaultValue = '#include <stdio.h>\n\nint main() {\n    // Write your code here\n    \n    return 0;\n}\n',
  language = 'cpp',
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
      language={language}
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
        suggestOnTriggerCharacters: true,
        quickSuggestions: {
          other: true,
          comments: true,
          strings: true
        },
        suggest: {
          showMethods: true,
          showFunctions: true,
          showConstructors: true,
          showFields: true,
          showProperties: true,
          showEvents: true,
          showOperators: true,
          showClasses: true,
          showInterfaces: true,
          showModules: true,
          showTypeParameters: true,
          showUnits: true,
          showValues: true,
          showConstants: true,
          showEnums: true,
          showEnumMembers: true,
          showKeywords: true,
          showWords: true,
          showColors: true,
          showFiles: true,
          showReferences: true,
          showFolders: true,
          showSnippets: true,
        },
      }}
    />
  );
};

export default CodeEditor;