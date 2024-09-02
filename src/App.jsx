import React, { useState } from "react";
import StartPage from "./components/StartPage";
import SignalSimulatorPage from "./components/SignalSimulatorPage";
import ChecksumPage from "./components/ChecksumPage";
import ResultsPage from "./components/ResultsPage";

const App = () => {
	const [page, setPage] = useState("start");
	const [name, setName] = useState("");
	const [elapsedTime, setElapsedTime] = useState(0);
	const [finalTime, setFinalTime] = useState(0);

	const handleStart = (name) => {
		setName(name);
		setElapsedTime(Date.now()); // Inicia o cronômetro
		setPage("signal-simulator");
	};

	const handleSignalSimulatorComplete = () => {
		setPage("checksum");
	};

	const handleChecksumComplete = (name, time) => {
		setFinalTime(time);
		setPage("results");
	};

	return (
		<div className="app-container">
			{page === "start" && <StartPage onStart={handleStart} />}
			{page === "signal-simulator" && (
				<SignalSimulatorPage
					name={name}
					elapsedTime={Date.now() - elapsedTime}
					onComplete={handleSignalSimulatorComplete}
				/>
			)}
			{page === "checksum" && (
				<ChecksumPage
					name={name}
					elapsedTime={Date.now() - elapsedTime}
					onComplete={handleChecksumComplete}
				/>
			)}
			{page === "results" && (
				<ResultsPage name={name} finalTime={finalTime} />
			)}
		</div>
	);
};

export default App;
