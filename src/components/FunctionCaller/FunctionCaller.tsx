import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './FunctionCaller.css';
declare var window: any;
// declare var ethers: any;

interface FunctionInput {
    name: string;
    type: string;
    value: string;
}

interface FunctionCallerProps {
    abi: any; // Specify a more precise type if you have a defined ABI type
    functionName: string;
    contractAddress: string;
}

const FunctionCaller: React.FC<FunctionCallerProps> = ({ abi, functionName, contractAddress }) => {
    const [inputs, setInputs] = useState<FunctionInput[]>([]);
    const [output, setOutput] = useState<string>('');

    useEffect(() => {
        setOutput('');
        if (!abi || !functionName) {
            setInputs([]);
            return;
        }

        if (abi && abi.inputs) {
            setInputs(abi.inputs.map((input: any) => ({
                ...input,
                value: '' // Initialize value for each input
            })));
        }
    }, [abi, functionName]);

    const handleInputChange = (index: number, value: string) => {
        setInputs(inputs.map((input, i) => i === index ? { ...input, value } : input));
    };

    const handleFunctionCall = async () => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const iface = new ethers.utils.Interface([abi]);
            const contract = new ethers.Contract(contractAddress, iface, provider.getSigner());

            const args = inputs.map(input => input.value);
            let response = await contract[functionName](...args);

            // Additional logic to format response
            // ...

            setOutput(JSON.stringify(response));
        } catch (error: any) {
            setOutput(`Error: ${error.message}`);
        }
    };

    return (
        <div className="function-caller">
            <h3>Call Function: {functionName}</h3>
            <div className="input-fields-container">
                {inputs.map((input, index) => (
                    <input
                        key={index}
                        className="input-field"
                        style={{
                            gridColumn: inputs.length === 1 ? 'span 3' : inputs.length === 2 ? 'span 1 / span 2' : 'auto'
                        }}
                        type="text"
                        placeholder={`${input.name} (${input.type})`}
                        value={input.value}
                        onChange={e => handleInputChange(index, e.target.value)}
                    />
                ))}
            </div>
            <button className="function-call-button" onClick={handleFunctionCall}>Call</button>
            <div className={`output-container ${output.startsWith('Error:') ? 'error' : ''}`}>
                Output: {output}
            </div>
        </div>
    );

};

export default FunctionCaller;
