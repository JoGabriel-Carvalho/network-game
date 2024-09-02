import React, { useState, useEffect } from "react";
import "./SignalSimulatorPage.css";
import SignalSimulator from "../components/SignalSimulator/SignalSimulator";

const SignalSimulatorPage = ({ name, onComplete }) => {
	const [startTime, setStartTime] = useState(Date.now());
	const [elapsedTime, setElapsedTime] = useState(0);
	const [isChallengeComplete, setIsChallengeComplete] = useState(false);

	useEffect(() => {
		if (!isChallengeComplete) {
			const interval = setInterval(() => {
				setElapsedTime(Date.now() - startTime);
			}, 100);

			return () => clearInterval(interval);
		}
	}, [startTime, isChallengeComplete]);

	const handleSignalSimulatorSuccess = () => {
		setIsChallengeComplete(true);
		onComplete();
	};

	return (
		<div className="signal-simulator-page-container">
			<h1>Desafio de Simulação de Sinal</h1>
			<p>Cronômetro: {(elapsedTime / 1000).toFixed(1)} segundos</p>
			<SignalSimulator onSuccess={handleSignalSimulatorSuccess} />
		</div>
	);
};

export default SignalSimulatorPage;
