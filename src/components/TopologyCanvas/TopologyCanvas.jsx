import React, { useState } from "react";
import { Stage, Layer, Line, Rect } from "react-konva";

const Device = ({ id, x, y, onDrag, onRightClick }) => (
	<Rect
		x={x}
		y={y}
		width={40}
		height={40}
		fill="blue"
		shadowBlur={5}
		cornerRadius={5}
		draggable
		onDragMove={(e) => onDrag(id, e.target.x(), e.target.y())}
		onContextMenu={(e) => {
			e.evt.preventDefault(); // Prevenir o menu de contexto padrão
			onRightClick(id, x, y);
		}}
	/>
);

const ControlPanel = ({ addDevice }) => (
	<div style={{ marginBottom: "10px" }}>
		<button onClick={() => addDevice("computer")}>Add Computer</button>
		<button onClick={() => addDevice("phone")}>Add Phone</button>
		<button onClick={() => addDevice("router")}>Add Router</button>
	</div>
);

const TopologyCanvas = () => {
	const [devices, setDevices] = useState([]);
	const [connections, setConnections] = useState([]);
	const [selectedDevice, setSelectedDevice] = useState(null);

	const addDevice = (type) => {
		const id = `${type}-${devices.length + 1}`;
		const newDevice = { id, type, x: 50, y: 50 };
		setDevices([...devices, newDevice]);
	};

	const handleDrag = (id, x, y) => {
		setDevices(
			devices.map((device) =>
				device.id === id ? { ...device, x, y } : device
			)
		);
	};

	const handleRightClick = (id, x, y) => {
		if (selectedDevice) {
			if (selectedDevice !== id) {
				// Adiciona uma nova conexão entre os dois dispositivos
				setConnections([
					...connections,
					{ from: selectedDevice, to: id },
				]);
				setSelectedDevice(null); // Resetar após a conexão
			}
		} else {
			setSelectedDevice(id); // Seleciona o primeiro dispositivo
		}
	};

	return (
		<div>
			<ControlPanel addDevice={addDevice} />
			<Stage
				width={window.innerWidth - 20}
				height={500}
				style={{ border: "2px solid black" }}
			>
				<Layer>
					{connections.map((connection, index) => {
						const fromDevice = devices.find(
							(device) => device.id === connection.from
						);
						const toDevice = devices.find(
							(device) => device.id === connection.to
						);
						return (
							<Line
								key={index}
								points={[
									fromDevice.x + 20,
									fromDevice.y + 20,
									toDevice.x + 20,
									toDevice.y + 20,
								]}
								stroke="black"
								strokeWidth={2}
							/>
						);
					})}
					{devices.map((device) => (
						<Device
							key={device.id}
							id={device.id}
							x={device.x}
							y={device.y}
							onDrag={handleDrag}
							onRightClick={handleRightClick}
						/>
					))}
				</Layer>
			</Stage>
		</div>
	);
};

export default TopologyCanvas;
