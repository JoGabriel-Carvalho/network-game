import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Line, Image } from "react-konva";
import computerImgSrc from "../../util/images/computer.png";
import routerImgSrc from "../../util/images/router.png";

const URLImage = ({ image, x, y, onDragMove, onRightClick }) => {
	const [img] = useState(new window.Image());
	const imageRef = useRef(null);

	useEffect(() => {
		img.src = image.src;
		img.onload = () => {
			imageRef.current.image(img);
			imageRef.current.getLayer().batchDraw();
		};
	}, [img, image.src]);

	return (
		<Image
			x={x}
			y={y}
			ref={imageRef}
			draggable
			onDragMove={onDragMove}
			onContextMenu={onRightClick}
			width={50}
			height={50}
		/>
	);
};

const ControlPanel = ({ addDevice }) => (
	<div style={{ marginBottom: "10px" }}>
		<button onClick={() => addDevice("computer")}>Add Computer</button>
		<button onClick={() => addDevice("router")}>Add Router</button>
	</div>
);

const TopologyCanvas = () => {
	const [devices, setDevices] = useState([]);
	const [connections, setConnections] = useState([]);
	const [selectedDevice, setSelectedDevice] = useState(null);

	const addDevice = (type) => {
		const id = `${type}-${devices.length + 1}`;
		const newDevice = {
			id,
			type,
			x: Math.random() * 400,
			y: Math.random() * 400,
			imgSrc: type === "computer" ? computerImgSrc : routerImgSrc,
		};
		setDevices([...devices, newDevice]);
	};

	const handleDragMove = (id, e) => {
		const { x, y } = e.target.position();
		setDevices(
			devices.map((device) =>
				device.id === id ? { ...device, x, y } : device
			)
		);
	};

	const handleRightClick = (id, e) => {
		e.evt.preventDefault(); // Prevent the default context menu
		if (selectedDevice) {
			if (selectedDevice !== id) {
				setConnections([
					...connections,
					{ from: selectedDevice, to: id },
				]);
				setSelectedDevice(null);
			}
		} else {
			setSelectedDevice(id);
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
									fromDevice.x + 25,
									fromDevice.y + 25,
									toDevice.x + 25,
									toDevice.y + 25,
								]}
								stroke="black"
								strokeWidth={2}
							/>
						);
					})}
					{devices.map((device) => (
						<URLImage
							key={device.id}
							image={{ src: device.imgSrc }}
							x={device.x}
							y={device.y}
							onDragMove={(e) => handleDragMove(device.id, e)}
							onRightClick={(e) => handleRightClick(device.id, e)}
						/>
					))}
				</Layer>
			</Stage>
		</div>
	);
};

export default TopologyCanvas;
