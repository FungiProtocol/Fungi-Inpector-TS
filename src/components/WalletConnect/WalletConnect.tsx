import React, { useState, useEffect } from 'react';
import './WalletConnect.css';
import { ethers } from "ethers";
declare var window: any;
// declare var ethers: any;

const WalletConnect: React.FC = () => {
    const [walletAddress, setWalletAddress] = useState<string>('');
    const [network, setNetwork] = useState<string>('');

    const getNetwork = async () => {
        if (window.ethereum) {
            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const networkData = await provider.getNetwork();
                setNetwork(networkData.name);
            } catch (error: any) { // Consider a more specific error type
                console.error("Error getting network:", error);
            }
        }
    };

    useEffect(() => {
        const handleAccountsChanged = (accounts: string[]) => {
            if (accounts.length > 0) {
                setWalletAddress(accounts[0]);
            } else {
                setWalletAddress('');
                setNetwork('');
            }
        };

        const handleChainChanged = (_chainId: string) => {
            getNetwork();
        };

        if (window.ethereum) {
            window.ethereum.on('accountsChanged', handleAccountsChanged);
            window.ethereum.on('chainChanged', handleChainChanged);

            getNetwork();
        }

        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
                window.ethereum.removeListener('chainChanged', handleChainChanged);
            }
        };
    }, []);

    const connectWalletHandler = async () => {
        if (walletAddress) {
            setWalletAddress('');
            setNetwork('');
        } else {
            if (window.ethereum && window.ethereum.isMetaMask) {
                try {
                    const accounts: string[] = await window.ethereum.request({ method: 'eth_requestAccounts' });
                    setWalletAddress(accounts[0]);
                    getNetwork();
                } catch (error: any) { // Consider a more specific error type
                    console.error(error);
                }
            } else {
                console.error("Please install MetaMask.");
            }
        }
    };

    return (
        <div className="wallet-connect">
            <button onClick={connectWalletHandler}>
                {walletAddress ? 'Disconnect Wallet' : 'Connect Wallet'}
            </button>
            {walletAddress && (
                <div>
                    <p>Connected Wallet: {walletAddress}</p>
                    <p>Network: {network}</p>
                </div>
            )}
        </div>
    );
};

export default WalletConnect;
