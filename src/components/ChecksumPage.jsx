import React, { useState, useEffect } from "react";
import "./ChecksumPage.css";
import Checksum from "../components/Checksum/Checksum";

const ChecksumPage = ({ name, onComplete, elapsedTime }) => {
	const [isChallengeComplete, setIsChallengeComplete] = useState(false);

	const handleChecksumSuccess = () => {
		setIsChallengeComplete(true);
		const finalTime = elapsedTime / 1000; // Convertendo para segundos
		onComplete(name, finalTime);
	};

	return (
		<div className="checksum-page-container">
			<h1>Desafio de Checksum</h1>
			<p>Cronômetro: {(elapsedTime / 1000).toFixed(1)} segundos</p>
			<Checksum onSuccess={handleChecksumSuccess} />
		</div>
	);
};

export default ChecksumPage;
