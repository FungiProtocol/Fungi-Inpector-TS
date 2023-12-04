import React, { useState, useEffect } from 'react';
import DiamondAddressInput from '../DiamondAddressInput/DiamondAddressInput';
import FacetInspector from '../FacetInspector/FacetInspector';
import { ethers } from 'ethers';
import inspectDiamond from '../InspectDiamond/InspectDiamond';
import './DiamondInspector.css';
declare var window: any;

interface InspectionResults {
    owner: string;
    facets: any[]; // Update this with a more specific type if possible
}

const DiamondInspector: React.FC = () => {
    const [diamondAddress, setDiamondAddress] = useState<string>('');
    const [inspectionResults, setInspectionResults] = useState<InspectionResults>({ owner: '', facets: [] });
    const [error, setError] = useState<string>('');

    const handleAddressSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevents the default form submission
        setError('');
        try {
            // Use state for diamondAddress, no need to pass it as a parameter
            await handleInspectDiamond(diamondAddress);
        } catch (e: any) {
            setError(e.message);
        }
    };

    const handleInspectDiamond = async (address: string) => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        try {
            const results = await inspectDiamond(address, provider);
            setInspectionResults(results);
            console.log("Inspection Results: ", results);
        } catch (error: any) {
            console.error("Error during inspection:", error);
            setError("Failed to inspect the diamond contract. No valid address provided.");
        }
    };

    useEffect(() => {
        if (diamondAddress) {
            handleInspectDiamond(diamondAddress);
        }
    }, [diamondAddress]);

    return (
        <div className="diamond-inspector-container">
            {/* Removed the <form> tag from here */}
            <DiamondAddressInput onAddressSubmit={setDiamondAddress} />
            {error && <p className="error-message">Error: {error}</p>}
            <div className="results-section">
                <FacetInspector
                    diamondAddress={diamondAddress}
                    facets={inspectionResults}
                />
            </div>
        </div>
    );
};

export default DiamondInspector;