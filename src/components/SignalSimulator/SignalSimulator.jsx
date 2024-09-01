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
	const initialSegments = Array(8).fill({
		amplitude: 50,
		frequency: 1, // Frequência inicial definida como 1
		phase: 0,
		correct: false,
	});

	const [segments, setSegments] = useState(initialSegments);
	const [selectedSegment, setSelectedSegment] = useState(0);
	const [binaryNumber, setBinaryNumber] = useState("");
	const [amplitudeValues, setAmplitudeValues] = useState({ zero: 0, one: 0 });
	const [frequencyValues, setFrequencyValues] = useState({ zero: 2, one: 2 });
	const [phaseValues, setPhaseValues] = useState({ zero: 0, one: Math.PI });
	const [currentStage, setCurrentStage] = useState("amplitude");
	const [allSegmentsCorrect, setAllSegmentsCorrect] = useState(false);

	useEffect(() => {
		const generateBinaryNumberAndValues = () => {
			let binary = "";
			let countZero = 0;
			let countOne = 0;

			for (let i = 0; i < 8; i++) {
				if (countZero < 2 && countOne < 2) {
					const bit = Math.floor(Math.random() * 2);
					binary += bit;
					bit === 0 ? countZero++ : countOne++;
				} else if (countZero < 2) {
					binary += "0";
					countZero++;
				} else if (countOne < 2) {
					binary += "1";
					countOne++;
				} else {
					const bit = Math.floor(Math.random() * 2);
					binary += bit;
					bit === 0 ? countZero++ : countOne++;
				}
			}

			setBinaryNumber(binary);

			let zeroAmplitude, oneAmplitude;
			do {
				zeroAmplitude = Math.floor(Math.random() * 5 + 1) * 20;
				oneAmplitude = Math.floor(Math.random() * 5 + 1) * 20;
			} while (zeroAmplitude === oneAmplitude);

			setAmplitudeValues({ zero: zeroAmplitude, one: oneAmplitude });

			let zeroFrequency, oneFrequency;
			do {
				zeroFrequency = Math.floor(Math.random() * 4) + 2; // Valores entre 2 e 5
				oneFrequency = Math.floor(Math.random() * 4) + 2; // Valores entre 2 e 5
			} while (zeroFrequency === oneFrequency);

			setFrequencyValues({ zero: zeroFrequency, one: oneFrequency });

			const newSegments = initialSegments.map((segment, index) => {
				const bit = binary[index];
				const correctAmplitude =
					segment.amplitude ===
					(bit === "1" ? oneAmplitude : zeroAmplitude);
				const correctFrequency =
					segment.frequency ===
					(bit === "1" ? oneFrequency : zeroFrequency);
				return {
					...segment,
					correct: correctAmplitude && correctFrequency,
				};
			});
			setSegments(newSegments);
			setAllSegmentsCorrect(
				newSegments.every((segment) => segment.correct)
			);
		};

		generateBinaryNumberAndValues();
	}, []);

	useEffect(() => {
		if (currentStage === "frequency") {
			const newSegments = segments.map((segment, index) => {
				const bit = binaryNumber[index];
				const targetFrequency =
					bit === "1" ? frequencyValues.one : frequencyValues.zero;
				const correctFrequency = segment.frequency === targetFrequency;
				return {
					...segment,
					correct: correctFrequency,
				};
			});
			setSegments(newSegments);
			setAllSegmentsCorrect(
				newSegments.every((segment) => segment.correct)
			);
		}

		if (currentStage === "phase") {
			const randomPhaseSegments = segments.map((segment, index) => {
				const bit = binaryNumber[index];
				const randomPhase = Math.random() < 0.5 ? 0 : Math.PI;
				const targetPhase =
					bit === "1" ? randomPhase : randomPhase === 0 ? Math.PI : 0;
				return {
					...segment,
					phase: randomPhase, // Define a fase inicial aleatória para cada segmento
					correct: segment.correct && segment.phase === targetPhase,
				};
			});
			setSegments(randomPhaseSegments);
			setAllSegmentsCorrect(
				randomPhaseSegments.every((segment) => segment.correct)
			);
		}
	}, [currentStage]);

	const updateSegment = (prop, value) => {
		const newSegments = [...segments];
		newSegments[selectedSegment] = {
			...newSegments[selectedSegment],
			[prop]: newSegments[selectedSegment][prop] + value,
		};

		if (currentStage === "amplitude") {
			const bit = binaryNumber[selectedSegment];
			const amplitude = newSegments[selectedSegment].amplitude;
			const targetAmplitude =
				bit === "1" ? amplitudeValues.one : amplitudeValues.zero;
			newSegments[selectedSegment].correct =
				amplitude === targetAmplitude;
			setAllSegmentsCorrect(
				newSegments.every((segment) => segment.correct)
			);
		}

		if (currentStage === "frequency") {
			const bit = binaryNumber[selectedSegment];
			const frequency = newSegments[selectedSegment].frequency;
			const targetFrequency =
				bit === "1" ? frequencyValues.one : frequencyValues.zero;
			newSegments[selectedSegment].correct =
				frequency === targetFrequency;
			setAllSegmentsCorrect(
				newSegments.every((segment) => segment.correct)
			);
		}

		if (currentStage === "phase") {
			const bit = binaryNumber[selectedSegment];
			const phase = newSegments[selectedSegment].phase;
			const targetPhase =
				bit === "1" ? phaseValues.one : phaseValues.zero;
			newSegments[selectedSegment].correct = phase === targetPhase;
			setAllSegmentsCorrect(
				newSegments.every((segment) => segment.correct)
			);
		}

		setSegments(newSegments);
	};

	const togglePhase = () => {
		if (currentStage === "phase") {
			const currentPhase = segments[selectedSegment].phase;
			const newPhase = currentPhase === 0 ? Math.PI : 0;
			updateSegment("phase", newPhase - currentPhase); // Altera a fase corretamente ao clicar várias vezes
		}
	};

	const advanceStage = () => {
		if (currentStage === "amplitude") {
			setCurrentStage("frequency");
		} else if (currentStage === "frequency") {
			setCurrentStage("phase");
		}
		setSegments(initialSegments);
		setAllSegmentsCorrect(false);
	};

	const generateSignalData = () => {
		const data = [];
		const labels = [];

		segments.forEach((segment, segmentIndex) => {
			for (let i = 0; i < 100; i++) {
				const x = (i / 100) * 2 * Math.PI * segment.frequency;
				const y =
					(segment.amplitude / 100) *
					100 *
					Math.sin(x + segment.phase);
				data.push(y);
				labels.push(segmentIndex * 100 + i);
			}
		});

		return {
			labels,
			datasets: [
				{
					label: "Sinal",
					data,
					borderColor: "white",
					borderWidth: 3,
					fill: false,
					pointRadius: 0,
				},
			],
		};
	};

	const chartOptions = {
		scales: {
			x: {
				display: false,
			},
			y: {
				min: -100,
				max: 100,
				ticks: {
					stepSize: 20,
					color: "white",
				},
				grid: {
					color: "rgba(255, 255, 255, 0.2)",
				},
			},
		},
		responsive: true,
		maintainAspectRatio: false,
	};

	return (
		<div className="signal-simulator">
			<div className="info-display">
				<p className="binary-number">
					<strong>Bits a serem transmitidos:</strong> {binaryNumber}
				</p>
				{currentStage === "amplitude" && (
					<>
						<p className="amplitude-info">
							<strong>Amplitude para 0:</strong>{" "}
							{amplitudeValues.zero}
						</p>
						<p className="amplitude-info">
							<strong>Amplitude para 1:</strong>{" "}
							{amplitudeValues.one}
						</p>
					</>
				)}
				{currentStage === "frequency" && (
					<>
						<p className="amplitude-info">
							<strong>Frequência para 0:</strong>{" "}
							{frequencyValues.zero}
						</p>
						<p className="amplitude-info">
							<strong>Frequência para 1:</strong>{" "}
							{frequencyValues.one}
						</p>
					</>
				)}
				{currentStage === "phase" && (
					<>
						<p className="amplitude-info">
							<strong>Fase para 0:</strong>{" "}
							{phaseValues.zero === 0 ? "0°" : "180°"}
						</p>
						<p className="amplitude-info">
							<strong>Fase para 1:</strong>{" "}
							{phaseValues.one === 0 ? "0°" : "180°"}
						</p>
					</>
				)}
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
				{currentStage === "amplitude" && (
					<>
						<button onClick={() => updateSegment("amplitude", 10)}>
							Aumentar Amplitude
						</button>
						<button onClick={() => updateSegment("amplitude", -10)}>
							Diminuir Amplitude
						</button>
					</>
				)}
				{currentStage === "frequency" && (
					<>
						<button onClick={() => updateSegment("frequency", 1)}>
							Aumentar Frequência
						</button>
						<button onClick={() => updateSegment("frequency", -1)}>
							Diminuir Frequência
						</button>
					</>
				)}
				{currentStage === "phase" && (
					<button onClick={togglePhase}>Alternar Fase</button>
				)}
			</div>
			{allSegmentsCorrect && currentStage !== "phase" && (
				<div className="advance-button">
					<button
						className="advance-stage-button"
						onClick={advanceStage}
					>
						Avançar para{" "}
						{currentStage === "amplitude" ? "Frequência" : "Fase"}
					</button>
				</div>
			)}
		</div>
	);
};

export default SignalSimulator;
