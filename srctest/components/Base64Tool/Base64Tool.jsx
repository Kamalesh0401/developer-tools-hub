import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setInput, setOutput } from '../../redux/slices/base64Slice';
import { encodeBase64, decodeBase64 } from '../../utils/base64Utils';

const Base64Tool = () => {
    const dispatch = useDispatch();
    const { input, output } = useSelector((state) => state.base64);

    const handleInput = (e) => dispatch(setInput(e.target.value));
    const handleEncode = () => dispatch(setOutput(encodeBase64(input)));
    const handleDecode = () => dispatch(setOutput(decodeBase64(input)));
    const copyOutput = () => navigator.clipboard.writeText(output);

    return (
        <div className="tool-container">
            <div className="tool-header">
                <h2>Base64 Encoder/Decoder</h2>
            </div>
            <div className="tool-content">
                <textarea
                    value={input}
                    onChange={handleInput}
                    placeholder="Enter text or Base64 string..."
                    style={{ width: '100%', marginBottom: '12px', height: '80px' }}
                />
                <div style={{ marginBottom: '12px' }}>
                    <button className="btn" onClick={handleEncode}>Encode</button>
                    <button className="btn" onClick={handleDecode}>Decode</button>
                </div>
                <div>
                    <textarea
                        value={output}
                        readOnly
                        style={{ width: '100%', height: '60px' }}
                    />
                </div>
                <button className="btn" onClick={copyOutput}>Copy</button>
            </div>
        </div>
    );
};
export default Base64Tool;
