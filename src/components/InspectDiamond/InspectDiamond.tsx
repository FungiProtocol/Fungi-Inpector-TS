import { ethers } from 'ethers';
// declare var provider: any;

interface Facet {
    address: string;
    functionSelectors: string[];
}

interface InspectionResult {
    owner: string;
    facets: Facet[];
}

const inspectDiamond = async (diamondAddress: string, provider: any): Promise<InspectionResult> => {
    if (!ethers.utils.isAddress(diamondAddress)) {
        throw new Error("Invalid address format");
    }

    // Assuming these functions are part of the diamond
    const diamondInterface = new ethers.utils.Interface([
        "function owner() external view returns (address)",
        "function facetAddresses() external view returns (address[])",
        "function facetFunctionSelectors(address facet) external view returns (bytes4[])"
    ]);

    const diamondContract = new ethers.Contract(diamondAddress, diamondInterface, provider);

    try {
        const owner = await diamondContract.owner();
        console.log("Diamond owner:", owner);

        const facetAddresses: string[] = await diamondContract.facetAddresses();
        const facets: Facet[] = [];

        for (let facetAddress of facetAddresses) {
            const functionSelectors: string[] = await diamondContract.facetFunctionSelectors(facetAddress);
            facets.push({ address: facetAddress, functionSelectors });
        }

        return { owner, facets };
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error inspecting diamond:", error.message);
        }
        return { owner: '', facets: [] };
    }
};

export default inspectDiamond;
