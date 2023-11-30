import React, { useState, useEffect } from 'react';
import "./App.css";
import FacetInspector from './components/FacetInspector/FacetInspector';
import WalletConnect from './components/WalletConnect/WalletConnect';
import DiamondAddressInput from './components/DiamondAddressInput/DiamondAddressInput';
import inspectDiamond from "./components/InspectDiamond/InspectDiamond";
import { ethers } from "ethers";
declare var window: any;
// declare var ethers: any;

interface InspectionResults {
  owner: string;
  facets: any[]; // Update this with a more specific type if possible
}

function App() {
  const [error, setError] = useState<string>('');
  const [inspectionResults, setInspectionResults] = useState<InspectionResults>({ owner: '', facets: [] });
  const [diamondAddress, setDiamondAddress] = useState<string>('0x4f1F87d512650f32bf9949C4c5Ef37a3cc891C6D');

  const handleAddressSubmit = async (address: string) => {
    setDiamondAddress(address);
    setError('');
    try {
      await handleInspectDiamond(address);
    } catch (e: any) { // Consider using a more specific error type if possible
      setError(e.message);
    }
  };

  const handleInspectDiamond = async (address: string) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    try {
      setDiamondAddress(address);
      const results = await inspectDiamond(address, provider);
      setInspectionResults(results);
      console.log("Inspection Results: ", results);
    } catch (error: any) { // Consider using a more specific error type if possible
      console.error("Error during inspection:", error);
      setError("Failed to inspect the diamond contract.");
    }
  };

  useEffect(() => {
    if (diamondAddress) {
      handleInspectDiamond(diamondAddress);
    }
  }, [diamondAddress]);

  return (
    <div className="App">
      <header className="App-header">
        <WalletConnect />
        <DiamondAddressInput onAddressSubmit={handleAddressSubmit} />
        {diamondAddress && (
          <FacetInspector diamondAddress={diamondAddress} facets={inspectionResults} />
        )}
      </header>
      {error && <div className="error">{error}</div>}
    </div>
  );
}

export default App;
