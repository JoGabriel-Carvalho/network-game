import React, { useEffect, useState } from "react";
import "./ResultsPage.css";

const ResultsPage = ({ name, finalTime }) => {
	const [results, setResults] = useState([]);

	useEffect(() => {
		const storedResults = JSON.parse(localStorage.getItem("results")) || [];
		const newResults = [...storedResults, { name, time: finalTime }];
		localStorage.setItem("results", JSON.stringify(newResults));
		setResults(newResults);
	}, [name, finalTime]);

	return (
		<div className="results-page-container">
			<h1>Resultado Final</h1>
			<p>
				{name}, seu tempo foi: {finalTime.toFixed(1)} segundos
			</p>
			<h2>Outros Resultados</h2>
			<ul className="results-list">
				{results.map((result, index) => (
					<li key={index}>
						{result.name}: {result.time.toFixed(1)} segundos
					</li>
				))}
			</ul>
		</div>
	);
};

export default ResultsPage;
