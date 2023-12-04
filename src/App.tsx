import "./App.css";
import WalletConnect from './components/WalletConnect/WalletConnect';
import FundInspector from './components/FundInspector/FundInspector';
import DiamondInspector from './components/DiamondInspector/DiamondInspector';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <WalletConnect />
        <h1>🔍 Diamond Inspector</h1>
        <DiamondInspector />
        <h1>🔍 Fund Inspector</h1>
        <FundInspector />
      </header>
    </div>
  );
}

export default App;
