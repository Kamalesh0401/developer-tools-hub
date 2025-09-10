// // src/components/JSONViewer/JSONViewer.jsx
// import React, { useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import AceEditor from 'react-ace';
// import 'ace-builds/src-noconflict/mode-json';
// import 'ace-builds/src-noconflict/theme-monokai';
// import 'ace-builds/src-noconflict/theme-github';
// import { setInput, setOutput, setError, setMode } from '../../redux/slices/jsonSlice';
// import { formatJSON, minifyJSON, validateJSON } from '../../utils/jsonUtils';

// const JSONViewer = () => {
//   const dispatch = useDispatch();
//   const { input, output, isValid, error, mode } = useSelector((state) => state.json);
//   const { isDark } = useSelector((state) => state.theme);

//   const handleInputChange = (value) => {
//     dispatch(setInput(value));

//     const validation = validateJSON(value);
//     if (validation.isValid) {
//       dispatch(setError(null));
//       if (mode === 'format') {
//         dispatch(setOutput(formatJSON(value)));
//       } else {
//         dispatch(setOutput(minifyJSON(value)));
//       }
//     } else {
//       dispatch(setError(validation.error));
//       dispatch(setOutput(''));
//     }
//   };

//   const handleFormat = () => {
//     dispatch(setMode('format'));
//     if (input && isValid) {
//       dispatch(setOutput(formatJSON(input)));
//     }
//   };

//   const handleMinify = () => {
//     dispatch(setMode('minify'));
//     if (input && isValid) {
//       dispatch(setOutput(minifyJSON(input)));
//     }
//   };

//   const copyToClipboard = () => {
//     navigator.clipboard.writeText(output);
//   };

//   return (
//     <div className="tool-container">
//       <div className="tool-header">
//         <h2>JSON Viewer / Formatter</h2>
//         <div className="tool-actions">
//           <button 
//             className={`btn ${mode === 'format' ? 'active' : ''}`}
//             onClick={handleFormat}
//           >
//             Format / Beautify
//           </button>
//           <button 
//             className={`btn ${mode === 'minify' ? 'active' : ''}`}
//             onClick={handleMinify}
//           >
//             Minify
//           </button>
//         </div>
//       </div>

//       <div className="tool-content">
//         <div className="input-section">
//           <h3>Input</h3>
//           <AceEditor
//             mode="json"
//             theme={isDark ? "monokai" : "github"}
//             onChange={handleInputChange}
//             value={input}
//             name="json-input"
//             editorProps={{ $blockScrolling: true }}
//             setOptions={{
//               enableBasicAutocompletion: true,
//               enableLiveAutocompletion: true,
//               enableSnippets: true,
//               showLineNumbers: true,
//               tabSize: 2,
//             }}
//             style={{ width: '100%', height: '400px' }}
//           />
//           {error && (
//             <div className="error-message">
//               ❌ Invalid JSON: {error}
//             </div>
//           )}
//         </div>

//         <div className="output-section">
//           <div className="output-header">
//             <h3>Output</h3>
//             {output && (
//               <button className="btn-copy" onClick={copyToClipboard}>
//                 Copy
//               </button>
//             )}
//           </div>
//           <AceEditor
//             mode="json"
//             theme={isDark ? "monokai" : "github"}
//             value={output}
//             name="json-output"
//             readOnly
//             editorProps={{ $blockScrolling: true }}
//             setOptions={{
//               showLineNumbers: true,
//               tabSize: 2,
//             }}
//             style={{ width: '100%', height: '400px' }}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default JSONViewer;




import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/theme-github';
import { setInput, setOutput, setError, setMode } from '../../redux/slices/jsonSlice';
import { formatJSON, minifyJSON, validateJSON } from '../../utils/jsonUtils';

const JSONViewer = () => {
  const dispatch = useDispatch();
  const { input, output, isValid, error, mode } = useSelector((state) => state.json);
  const { isDark } = useSelector((state) => state.theme);

  const handleInputChange = (value) => {
    dispatch(setInput(value));
    const validation = validateJSON(value);
    if (validation.isValid) {
      dispatch(setError(null));
      if (mode === 'format') dispatch(setOutput(formatJSON(value)));
      else dispatch(setOutput(minifyJSON(value)));
    } else {
      dispatch(setError(validation.error));
      dispatch(setOutput(''));
    }
  };
  const handleFormat = () => {
    dispatch(setMode('format'));
    if (input && isValid) dispatch(setOutput(formatJSON(input)));
  };
  const handleMinify = () => {
    dispatch(setMode('minify'));
    if (input && isValid) dispatch(setOutput(minifyJSON(input)));
  };
  const copyToClipboard = () => navigator.clipboard.writeText(output);

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h2>JSON Viewer / Formatter</h2>
        <div className="tool-actions">
          <button className={`btn ${mode === 'format' ? 'active' : ''}`} onClick={handleFormat}>Format / Beautify</button>
          <button className={`btn ${mode === 'minify' ? 'active' : ''}`} onClick={handleMinify}>Minify</button>
        </div>
      </div>
      <div className="tool-content">
        <div className="input-section">
          <h3>Input</h3>
          <AceEditor
            mode="json"
            theme={isDark ? "monokai" : "github"}
            onChange={handleInputChange}
            value={input}
            name="json-input"
            editorProps={{ $blockScrolling: true }}
            setOptions={{ showLineNumbers: true, tabSize: 2 }}
            style={{ width: '100%', height: '400px' }}
          />
          {error && <div className="error-message">❌ Invalid JSON: {error}</div>}
        </div>
        <div className="output-section">
          <div className="output-header">
            <h3>Output</h3>
            {output && <button className="btn-copy" onClick={copyToClipboard}>Copy</button>}
          </div>
          <AceEditor
            mode="json"
            theme={isDark ? "monokai" : "github"}
            value={output}
            name="json-output"
            readOnly
            editorProps={{ $blockScrolling: true }}
            setOptions={{ showLineNumbers: true, tabSize: 2 }}
            style={{ width: '100%', height: '400px' }}
          />
        </div>
      </div>
    </div>
  );
};
export default JSONViewer;
