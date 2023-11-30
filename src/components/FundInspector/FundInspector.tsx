import React, { useState } from 'react';
import { ethers } from 'ethers';
import FundABI from '../../abi/FundABI/Fund.json';
import FunctionCaller from '../FunctionCaller/FunctionCaller';
import './FundInspector.css';

interface FunctionCallerProps {
    abi: any;
    functionName: string;
    contractAddress: string;
}

const FundInspector: React.FC = () => {
    const [fundAddress, setFundAddress] = useState('');
    const [selectedFunctionName, setSelectedFunctionName] = useState('');
    const [selectedFunctionIndex, setSelectedFunctionIndex] = useState<number | null>(null);
    const [selectedAbi, setSelectedAbi] = useState<any>(null);

    const handleFundAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFundAddress(e.target.value);
    };

    const handleFunctionSelect = (functionName: string, index: number) => {
        setSelectedFunctionName(functionName);
        setSelectedFunctionIndex(index);
        setSelectedAbi(FundABI.abi[index]);
    };

    return (
        <div className="fund-inspector-wrapper" style={{ display: 'flex' }}>
            <div className="fund-inspector-container" style={{ flex: 1 }}>
                <div className="fund-address-input">
                    <input
                        type="text"
                        value={fundAddress}
                        onChange={handleFundAddressChange}
                        placeholder="Enter Fund Address"
                    />
                    <button onClick={() => handleFunctionSelect(fundAddress, 0)}>Inspect Fund</button>
                </div>
                <div className="function-list">
                    {FundABI.abi.map((fragment, index) => {
                        if (fragment.type === 'function') {
                            return (
                                <button
                                    key={index}
                                    onClick={() => handleFunctionSelect(fragment.name ?? '', index)}
                                >
                                    {fragment.name}
                                </button>
                            );
                        }
                        return null;
                    })}
                </div>
            </div>
            {selectedFunctionName && (
                <div className="function-caller-container" style={{ flex: 2 }}>
                    <FunctionCaller
                        abi={selectedAbi}
                        functionName={selectedFunctionName}
                        contractAddress={fundAddress}
                    />
                </div>
            )}
        </div>
    );
};

export default FundInspector;
