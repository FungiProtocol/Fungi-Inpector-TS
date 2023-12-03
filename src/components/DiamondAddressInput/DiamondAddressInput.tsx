import React, { useState } from 'react';
import './DiamondAddressInput.css';

interface DiamondAddressInputProps {
    onAddressSubmit: (address: string) => void;
}

const DiamondAddressInput: React.FC<DiamondAddressInputProps> = ({ onAddressSubmit }) => {
    const [address, setAddress] = useState<string>('0xf274De14171Ab928A5Ec19928cE35FaD91a42B64');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onAddressSubmit(address);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter Diamond Address"
            />
            <button type="submit">Inspect Diamond</button>
        </form>
    );
};

export default DiamondAddressInput;
