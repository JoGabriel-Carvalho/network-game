import React from "react";
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

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
);

const SignalSegment = ({
	amplitude,
	frequency,
	phase,
	onAmplitudeChange,
	onFrequencyChange,
	onPhaseChange,
}) => {
	const generateSegmentData = () => {
		const data = [];
		const labels = [];

		for (let i = 0; i < 45; i++) {
			// Aproximadamente 1/8 de um ciclo de 360 graus
			const x = i * (Math.PI / 180);
			const y = amplitude * Math.sin(frequency * x + phase);
			data.push(y);
			labels.push(i);
		}

		return {
			labels,
			datasets: [
				{
					label: "Signal Segment",
					data,
					borderColor: "rgba(75, 192, 192, 1)",
					borderWidth: 2,
					fill: false,
				},
			],
		};
	};

	return (
		<div className="signal-segment">
			<Line data={generateSegmentData()} />
			<div className="controls">
				<div>
					<button onClick={() => onAmplitudeChange(10)}>
						Increase Amplitude
					</button>
					<button onClick={() => onAmplitudeChange(-10)}>
						Decrease Amplitude
					</button>
				</div>
				<div>
					<button onClick={() => onFrequencyChange(0.1)}>
						Increase Frequency
					</button>
					<button onClick={() => onFrequencyChange(-0.1)}>
						Decrease Frequency
					</button>
				</div>
				<div>
					<button
						onClick={() => onPhaseChange(phase === 0 ? Math.PI : 0)}
					>
						Toggle Phase
					</button>
				</div>
			</div>
		</div>
	);
};

export default SignalSegment;
