import React, { useState, useEffect } from "react";
import "./Checksum.css";

const Checksum = ({ bits = "" }) => {
	const [answers, setAnswers] = useState(Array(5).fill("")); // 5 quadrados para a resposta
	const [checksumResult, setChecksumResult] = useState("");
	const [isChecksumCorrect, setIsChecksumCorrect] = useState(null);

	useEffect(() => {
		if (bits.length !== 8) {
			console.error("O número de bits deve ser 8.");
		}
	}, [bits]);

	const handleInputChange = (e, index) => {
		const { value } = e.target;
		if (/^[01]?$/.test(value)) {
			// Permite apenas 0 ou 1, ou vazio
			const newAnswers = [...answers];
			newAnswers[index] = value;
			setAnswers(newAnswers);
		}
	};

	const calculateChecksum = () => {
		const topBits = bits.slice(0, 4);
		const bottomBits = bits.slice(4);

		const topValue = parseInt(topBits, 2);
		const bottomValue = parseInt(bottomBits, 2);
		const sum = topValue + bottomValue;
		const checksum = sum.toString(2).padStart(5, "0").slice(-5); // 5 bits para a resposta
		setChecksumResult(checksum);
		setIsChecksumCorrect(checksum === answers.join(""));
	};

	return (
		<div className="checksum-container">
			<h2 className="checksum-title">
				Verifique se os bits foram transferidos de maneira correta com o
				checksum
			</h2>

			<div className="bit-section">
				<div className="bit-row">
					<div className="bit-box empty-box"></div>{" "}
					{/* Quadrado adicional no topo */}
					{bits
						.slice(0, 4)
						.split("")
						.map((bit, index) => (
							<div key={index} className="bit-box">
								{bit}
							</div>
						))}
				</div>
				<div className="bit-row">
					<div className="bit-box operator-box">+</div>
					{bits
						.slice(4)
						.split("")
						.map((bit, index) => (
							<div key={index} className="bit-box">
								{bit}
							</div>
						))}
				</div>
			</div>

			<div className="answer-section">
				{answers.map((answer, index) => (
					<input
						key={index}
						type="text"
						className="sum-input"
						value={answer}
						onChange={(e) => handleInputChange(e, index)}
						maxLength="1"
					/>
				))}
			</div>

			<button className="checksum-button" onClick={calculateChecksum}>
				Verificar Checksum
			</button>

			{checksumResult && (
				<div className="checksum-result">
					Resultado: {checksumResult}
					{isChecksumCorrect !== null && (
						<p
							className={
								isChecksumCorrect ? "correct" : "incorrect"
							}
						>
							{isChecksumCorrect
								? "Checksum Correto!"
								: "Checksum Incorreto!"}
						</p>
					)}
				</div>
			)}
		</div>
	);
};

export default Checksum;
