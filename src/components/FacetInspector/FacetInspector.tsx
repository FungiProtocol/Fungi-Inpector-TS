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
        name: string;
    }>;
}

const FacetInspector: React.FC<FacetInspectorProps> = ({ diamondAddress, facets }) => {
    const abis: { [key: string]: Abi } = {
        IDiamondLoupe,
        // FundFactory,
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

    const handleFunctionSelect = (facetName: string, functionName: string, abi: Abi, index: number) => {
        setSelectedFacet(facetName);
        setSelectedFunctionName(functionName);
        setSelectedFunctionIndex(index);
        setSelectedAbi(abi);
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
        <div className="facet-inspector-container">
            <div className="inspection-results">
                <h3>Facets:</h3>
                {Object.entries(abis).map(([name, abi], idx) => {
                    let facetAddress = handleFacetAddress(idx);

                    return (
                        <div key={idx} className="facet">
                            <p><strong>Facet Name:</strong> {name}</p>
                            <p><strong>Facet Address:</strong> {facetAddress}</p>
                            <div className="function-list">
                                {abi.abi.map((fragment, index) => {
                                    if (fragment.type === 'function') {
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
                    );
                })}
            </div>
            {selectedFacet && selectedFunctionName && (
                <div className="function-caller-container">
                    <FunctionCaller
                        abi={selectedAbi?.abi[selectedFunctionIndex ?? 0]}
                        functionName={selectedFunctionName}
                        diamondAddress={diamondAddress}
                    />
                </div>
            )}
        </div>
    );
};

export default FacetInspector;
