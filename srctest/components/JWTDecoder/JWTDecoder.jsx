// // src/components/JWTDecoder/JWTDecoder.jsx
// import React from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import AceEditor from 'react-ace';
// import { setJWTInput, setDecodedJWT } from '../../redux/slices/jwtSlice';
// import { decodeJWT } from '../../utils/jwtUtils';

// const JWTDecoder = () => {
//     const dispatch = useDispatch();
//     const { input, decoded, error } = useSelector((state) => state.jwt);
//     const { isDark } = useSelector((state) => state.theme);

//     const handleInputChange = (value) => {
//         dispatch(setJWTInput(value));
//         const result = decodeJWT(value);
//         dispatch(setDecodedJWT(result));
//     };

//     const copySection = (section) => {
//         navigator.clipboard.writeText(JSON.stringify(decoded[section], null, 2));
//     };

//     return (
//         <div className="tool-container">
//             <div className="tool-header">
//                 <h2>JWT Decoder</h2>
//             </div>

//             <div className="jwt-input-section">
//                 <h3>JWT Token</h3>
//                 <textarea
//                     className="jwt-input"
//                     placeholder="Paste your JWT token here..."
//                     value={input}
//                     onChange={(e) => handleInputChange(e.target.value)}
//                 />
//             </div>

//             {decoded && (
//                 <div className="jwt-output">
//                     <div className="jwt-section">
//                         <div className="section-header">
//                             <h3>Header</h3>
//                             <button onClick={() => copySection('header')}>Copy</button>
//                         </div>
//                         <AceEditor
//                             mode="json"
//                             theme={isDark ? "monokai" : "github"}
//                             value={JSON.stringify(decoded.header, null, 2)}
//                             readOnly
//                             name="jwt-header"
//                             style={{ width: '100%', height: '150px' }}
//                         />
//                     </div>

//                     <div className="jwt-section">
//                         <div className="section-header">
//                             <h3>Payload</h3>
//                             <button onClick={() => copySection('payload')}>Copy</button>
//                         </div>
//                         <AceEditor
//                             mode="json"
//                             theme={isDark ? "monokai" : "github"}
//                             value={JSON.stringify(decoded.payload, null, 2)}
//                             readOnly
//                             name="jwt-payload"
//                             style={{ width: '100%', height: '200px' }}
//                         />
//                     </div>

//                     <div className="jwt-section">
//                         <div className="section-header">
//                             <h3>Signature</h3>
//                             <button onClick={() => copySection('signature')}>Copy</button>
//                         </div>
//                         <div className="signature-display">
//                             {decoded.signature}
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {error && (
//                 <div className="error-message">
//                     ❌ {error}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default JWTDecoder;




import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AceEditor from 'react-ace';
import { setJWTInput, setDecodedJWT } from '../../redux/slices/jwtSlice';
import { decodeJWT } from '../../utils/jwtUtils';

const JWTDecoder = () => {
    const dispatch = useDispatch();
    const { input, decoded, error } = useSelector((state) => state.jwt);
    const { isDark } = useSelector((state) => state.theme);

    const handleInputChange = (e) => {
        const value = e.target.value;
        dispatch(setJWTInput(value));
        dispatch(setDecodedJWT(decodeJWT(value)));
    };

    const copySection = (section) => {
        if (decoded && decoded[section])
            navigator.clipboard.writeText(JSON.stringify(decoded[section], null, 2));
    };

    return (
        <div className="tool-container">
            <div className="tool-header">
                <h2>JWT Decoder</h2>
            </div>
            <div className="jwt-input-section">
                <h3>JWT Token</h3>
                <textarea
                    className="jwt-input"
                    placeholder="Paste JWT token here..."
                    value={input}
                    onChange={handleInputChange}
                />
            </div>
            {decoded && (
                <div className="jwt-output">
                    <div className="jwt-section">
                        <div className="section-header">
                            <h3>Header</h3>
                            <button onClick={() => copySection('header')}>Copy</button>
                        </div>
                        <AceEditor
                            mode="json"
                            theme={isDark ? "monokai" : "github"}
                            value={JSON.stringify(decoded.header, null, 2)}
                            readOnly
                            name="jwt-header"
                            style={{ width: '100%', height: '100px' }}
                        />
                    </div>
                    <div className="jwt-section">
                        <div className="section-header">
                            <h3>Payload</h3>
                            <button onClick={() => copySection('payload')}>Copy</button>
                        </div>
                        <AceEditor
                            mode="json"
                            theme={isDark ? "monokai" : "github"}
                            value={JSON.stringify(decoded.payload, null, 2)}
                            readOnly
                            name="jwt-payload"
                            style={{ width: '100%', height: '120px' }}
                        />
                    </div>
                    <div className="jwt-section">
                        <div className="section-header">
                            <h3>Signature</h3>
                            <button onClick={() => copySection('signature')}>Copy</button>
                        </div>
                        <div className="signature-display">{decoded.signature}</div>
                    </div>
                </div>
            )}
            {error && <div className="error-message">❌ {error}</div>}
        </div>
    );
};
export default JWTDecoder;
