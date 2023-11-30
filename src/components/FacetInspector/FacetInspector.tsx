import React, { useState, useEffect } from 'react';
import IDiamondLoupe from '../../abi/IDiamondLoupe.json';
import FundFactory from '../../abi/FundFactory.json';
import IDiamondCut from '../../abi/IDiamondCut.json';
import IOwnershipFacet from '../../abi/IOwnershipFacet.json';
import Pricefeed from '../../abi/Pricefeed.json';
import GenericSwapFacet from '../../abi/GenericSwapFacet.json';
import FunctionCaller from '../FunctionCaller/FunctionCaller';
import './FacetInspector.css';

// Define interfaces for props and state
interface FacetInspectorProps {
    diamondAddress: string;
    facets: {
        owner: string;
        facets: Array<{
            address: string;
            functionSelectors: string[];
        }>;
    };
}

interface Abi {
    abi: Array<{
        type: string;
        name?: string;  // Make name optional
        inputs?: Array<any>; // Add other optional properties as needed
        stateMutability?: string;
    }>;
}

const FacetInspector: React.FC<FacetInspectorProps> = ({ diamondAddress, facets }) => {
    const abis: { [key: string]: Abi } = {
        IDiamondLoupe,
        FundFactory,
        IDiamondCut,
        IOwnershipFacet,
        Pricefeed,
        GenericSwapFacet,
    };

    const defaultFunctionIndex = IDiamondLoupe.abi.findIndex(
        fragment => fragment.type === 'function' && fragment.name === 'facetAddresses'
    );

    const [selectedFacet, setSelectedFacet] = useState<string | null>(null);
    const [selectedFunctionName, setSelectedFunctionName] = useState<string>('');
    const [selectedFunctionIndex, setSelectedFunctionIndex] = useState<number | null>(null);
    const [selectedAbi, setSelectedAbi] = useState<Abi | null>(null);
    const [collapsedFacets, setCollapsedFacets] = useState<{ [key: string]: boolean }>(
        Object.keys(abis).reduce((acc, key) => ({ ...acc, [key]: true }), {})
    );

    const handleFunctionSelect = (
        facetName: string,
        functionName: string | undefined,
        abi: Abi,
        index: number
    ) => {
        if (functionName) {
            setSelectedFacet(facetName);
            setSelectedFunctionName(functionName);
            setSelectedFunctionIndex(index);
            setSelectedAbi(abi);
        } else {
            // Handle the case where functionName is undefined
            console.error("Function name is undefined");
        }
    };

    const toggleCollapse = (facetName: string) => {
        setCollapsedFacets(prevState => ({
            ...prevState,
            [facetName]: !prevState[facetName],
        }));
    };

    useEffect(() => {
        if (defaultFunctionIndex !== -1) {
            handleFunctionSelect('IDiamondLoupe', 'facetAddresses', IDiamondLoupe, defaultFunctionIndex);
        }
    }, []);

    const handleFacetAddress = (index: number): string => {
        if (index >= 0 && index < facets.facets.length) {
            return facets.facets[index].address;
        }
        return 'Unknown Address';
    };

    return (
        <div className="facet-inspector-wrapper" style={{ display: 'flex' }}>
            <div className="facet-inspector-container">
                {Object.entries(abis).map(([name, abi], idx) => {
                    const isCollapsed = collapsedFacets[name];
                    return (
                        <div key={idx} className={`facet ${isCollapsed ? 'collapsed' : ''}`}>
                            <div className="facet-name" onClick={() => toggleCollapse(name)}>
                                {name}
                            </div>
                            {!isCollapsed && (
                                <div>
                                    <p>Address: {handleFacetAddress(idx)}</p>
                                    <div className="function-list">
                                        {abi.abi.map((fragment, index) => {
                                            if (fragment.type === 'function' && fragment.name) {
                                                return (
                                                    <button
                                                        key={index}
                                                        className="function-button"
                                                        onClick={() => handleFunctionSelect(name, fragment.name, abi, index)}
                                                    >
                                                        {fragment.name}
                                                    </button>
                                                );
                                            }
                                            return null;
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            {selectedFacet && selectedFunctionName && (
                <div className="function-caller-container">
                    <FunctionCaller
                        abi={selectedAbi?.abi[selectedFunctionIndex ?? 0]}
                        functionName={selectedFunctionName}
                        contractAddress={diamondAddress}
                    />
                </div>
            )}
        </div>
    );




};

export default FacetInspector;
