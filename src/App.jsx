import React from "react";
import SignalSimulator from "./components/SignalSimulator/SignalSimulator";
import Checksum from "./components/Checksum/Checksum";

function App() {
	return (
		<div className="App">
			<Checksum bits="11010011" />
		</div>
	);
}

export default App;
