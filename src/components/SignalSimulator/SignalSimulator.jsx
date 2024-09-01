import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import "./SignalSimulator.css";

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
);

const SignalSimulator = () => {
	const [segments, setSegments] = useState(
		Array(8).fill({
			amplitude: 50,
			frequency: 1,
			phase: 0,
			correct: false,
		})
	);
	const [selectedSegment, setSelectedSegment] = useState(0); // Segmento inicialmente selecionado
	const [binaryNumber, setBinaryNumber] = useState("");
	const [amplitudeValues, setAmplitudeValues] = useState({ zero: 0, one: 0 });

	useEffect(() => {
		// Gera um número binário de 8 dígitos aleatório e define os valores de amplitude
		const generateBinaryNumberAndAmplitude = () => {
			let binary = "";
			for (let i = 0; i < 8; i++) {
				binary += Math.floor(Math.random() * 2);
			}
			setBinaryNumber(binary);

			// Define os valores de amplitude como múltiplos de 20, garantindo que sejam diferentes
			let zeroAmplitude, oneAmplitude;
			do {
				zeroAmplitude = Math.floor(Math.random() * 5 + 1) * 20; // Múltiplos de 20 entre 20 e 100
				oneAmplitude = Math.floor(Math.random() * 5 + 1) * 20; // Múltiplos de 20 entre 20 e 100
			} while (zeroAmplitude === oneAmplitude);

			setAmplitudeValues({ zero: zeroAmplitude, one: oneAmplitude });
		};

		generateBinaryNumberAndAmplitude();
	}, []);

	const updateSegment = (prop, value) => {
		const newSegments = [...segments];
		newSegments[selectedSegment] = {
			...newSegments[selectedSegment],
			[prop]: newSegments[selectedSegment][prop] + value,
		};

		// Verifica se a amplitude está correta
		const bit = binaryNumber[selectedSegment];
		const amplitude = newSegments[selectedSegment].amplitude;
		const targetAmplitude =
			bit === "1" ? amplitudeValues.one : amplitudeValues.zero;
		newSegments[selectedSegment].correct = amplitude === targetAmplitude;

		setSegments(newSegments);
	};

	const togglePhase = () => {
		const currentPhase = segments[selectedSegment].phase;
		const newPhase = currentPhase === 0 ? Math.PI : 0;
		updateSegment("phase", newPhase);
	};

	const generateSignalData = () => {
		const data = [];
		const labels = [];

		segments.forEach((segment, segmentIndex) => {
			for (let i = 0; i < 100; i++) {
				// 100 pontos para garantir um ciclo completo, podendo variar conforme a frequência
				const x = (i / 100) * 2 * Math.PI; // Gera um ciclo completo de 0 a 2π
				const y =
					(segment.amplitude / 100) *
					100 *
					Math.sin(segment.frequency * x + segment.phase);
				data.push(y);
				labels.push(segmentIndex * 100 + i); // Adiciona a posição do segmento
			}
		});

		return {
			labels,
			datasets: [
				{
					label: "Sinal",
					data,
					borderColor: "white", // Linha do sinal em branco
					borderWidth: 3,
					fill: false,
					pointRadius: 0, // Remove os pontos (bolinhas)
				},
			],
		};
	};

	const chartOptions = {
		scales: {
			x: {
				display: false, // Remove os números do eixo horizontal
			},
			y: {
				min: -100, // Limite inferior do eixo Y
				max: 100, // Limite superior do eixo Y
				ticks: {
					stepSize: 20,
					color: "white", // Define a cor da linha horizontal para branco
				},
				grid: {
					color: "rgba(255, 255, 255, 0.2)", // Grade mais sutil
				},
			},
		},
		responsive: true,
		maintainAspectRatio: false,
	};

	return (
		<div className="signal-simulator">
			<div className="info-display">
				<p>
					<strong>Bits a serem transmitidos:</strong> {binaryNumber}
				</p>
				<p>
					<strong>Amplitude para 0:</strong> {amplitudeValues.zero}
				</p>
				<p>
					<strong>Amplitude para 1:</strong> {amplitudeValues.one}
				</p>
			</div>
			<div className="number-display">
				{segments.map((segment, index) => (
					<div key={index} className="number-box">
						{segment.correct ? binaryNumber[index] : ""}
					</div>
				))}
			</div>
			<div className="chart-container">
				<Line data={generateSignalData()} options={chartOptions} />
			</div>
			<div className="segment-selector">
				{segments.map((_, index) => (
					<button
						key={index}
						className={index === selectedSegment ? "selected" : ""}
						onClick={() => setSelectedSegment(index)}
					>
						Segmento {index + 1}
					</button>
				))}
			</div>
			<div className="controls">
				<button onClick={() => updateSegment("amplitude", 10)}>
					Aumentar Amplitude
				</button>
				<button onClick={() => updateSegment("amplitude", -10)}>
					Diminuir Amplitude
				</button>
				<button onClick={() => updateSegment("frequency", 1)}>
					Aumentar Frequência
				</button>
				<button onClick={() => updateSegment("frequency", -1)}>
					Diminuir Frequência
				</button>
				<button onClick={togglePhase}>Alternar Fase</button>
			</div>
		</div>
	);
};

export default SignalSimulator;
