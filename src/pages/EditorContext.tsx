import { createContext, useContext, useState } from 'react';

const EditorContext = createContext({
    activeEditor: null,
    setActiveEditor: () => {}
  });

export const useEditorContext = () => {
  return useContext(EditorContext);
};

export const EditorProvider = ({ children }) => {
  const [activeEditor, setActiveEditor] = useState(null);

  return (
    <EditorContext.Provider value={{ activeEditor, setActiveEditor }}>
      {children}
    </EditorContext.Provider>
  );
};

export default EditorContext;
