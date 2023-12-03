import React, { useState } from 'react';
import FundABI from '../../abi/FundABI/Fund.json';
import FunctionCaller from '../FunctionCaller/FunctionCaller';
import './FundInspector.css';

const FundInspector: React.FC = () => {
    const [fundAddress, setFundAddress] = useState('');
    const [selectedFunctionName, setSelectedFunctionName] = useState('');
    const [selectedAbi, setSelectedAbi] = useState<any>(null);
    const [inspected, setInspected] = useState(false);

    const handleFundAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFundAddress(e.target.value);
        setInspected(false);
    };

    const handleFunctionSelect = (functionName: string, index: number) => {
        // Only update the state if the address is valid
        if (isValidAddress(fundAddress)) {
            setSelectedFunctionName(functionName);
            setSelectedAbi(FundABI.abi[index]);
            setInspected(true);
        } else {
            // If the address is not valid, reset the inspected state
            setInspected(false);
        }
    };

    const isValidAddress = (address: string) => {
        // Add more robust validation for Ethereum addresses if necessary
        return address.length === 42 && address.startsWith('0x');
    };

    return (
        <div className="fund-inspector-wrapper">
            <div className="fund-address-container">
                <input
                    type="text"
                    value={fundAddress}
                    onChange={handleFundAddressChange}
                    placeholder="Enter Fund Address"
                />
                <button onClick={() => handleFunctionSelect(fundAddress, 0)}>
                    Inspect Fund
                </button>
            </div>
            <div className="fund-inspector-container">
                {inspected && (
                    <div className="function-list">
                        {FundABI.abi.map((fragment, index) => {
                            if (fragment.type === 'function') {
                                return (
                                    <button
                                        key={index}
                                        className="function-button"
                                        onClick={() => handleFunctionSelect(fragment.name ?? '', index)}
                                    >
                                        {fragment.name}
                                    </button>
                                );
                            }
                            return null;
                        })}
                    </div>
                )}
                {inspected && selectedFunctionName && (
                    <div className="function-caller-container">
                        <FunctionCaller
                            abi={selectedAbi}
                            functionName={selectedFunctionName}
                            contractAddress={fundAddress}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default FundInspector;
