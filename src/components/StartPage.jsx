import React, { useState } from "react";
import "./StartPage.css";

const StartPage = ({ onStart }) => {
	const [name, setName] = useState("");

	const handleStart = () => {
		if (name.trim()) {
			onStart(name);
		}
	};

	return (
		<div className="start-page-container">
			<h1>Desafio de Checksum - Camada OSI</h1>
			<input
				type="text"
				className="name-input"
				placeholder="Digite seu nome"
				value={name}
				onChange={(e) => setName(e.target.value)}
			/>
			<button className="start-button" onClick={handleStart}>
				Start
			</button>
		</div>
	);
};

export default StartPage;
