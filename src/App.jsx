import React from "react";
import SignalSimulator from "./components/SignalSimulator/SignalSimulator";
import Checksum from "./components/Checksum/Checksum";

function App() {
	return (
		<div className="App">
			<Checksum bits="11110011" />
		</div>
	);
}

export default App;
