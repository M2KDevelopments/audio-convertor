/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef, useState } from 'react'
// FFMPEG - https://ffmpegwasm.netlify.app/docs/getting-started/usage
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

function App() {

	const [ffmpegLoaded, setFFmpegLoaded] = useState(false);
	const ffmpegRef = useRef(new FFmpeg());
	const audioRef = useRef<HTMLAudioElement>(null);
	const [url, setURL] = useState("");

	useEffect(() => {
		const load = async () => {
			try {
				const baseURL = 'https://unpkg.com/@ffmpeg/core-mt@0.12.10/dist/esm'; // '' or 'https://unpkg.com/@ffmpeg/core-mt@0.12.10/dist/esm';
				const ffmpeg = ffmpegRef.current;
				ffmpeg.on('log', (data) => {
					console.log(data);
					if (data.type == 'stderr') {
						const log = data.message;
						console.log(data.type, data.message)
						if (log.includes("fps")) {
							// eslint-disable-next-line no-useless-escape
							// const frame = (parseInt(log.replace(/.*frame\=|fps.*/g, '').trim())) 
						}
					}
				});

				console.log('Loading FFMPEG')
				// toBlobURL is used to bypass CORS issue, urls with the same
				// domain can be used directly.
				await ffmpeg.load({
					coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
					wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
					workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, "text/javascript"),
					// workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, "text/javascript", true, console.log),
				})
				setFFmpegLoaded(true);
				console.log('Loaded FFMPEG.wasm');
			} catch (err) {
				console.log(err);
			}
		}


		load();
	}, []);


	const onFFMPEgConversion = useCallback(async (source: any) => {
		const ffmpeg = ffmpegRef.current;
		try {
			await ffmpeg.deleteFile(`output.mp3`);
		} catch (err) {
			console.error(err);
		}
		try {
			await ffmpeg.writeFile('input.mp3', await fetchFile(source));
			const command = `-i input.mp3 output.mp3`.split(' ');
			await ffmpeg.exec(command);
			const data: any = await ffmpeg.readFile(`output.mp3`);
			if (audioRef.current) audioRef.current.src = URL.createObjectURL(new Blob([data], { type: 'audio/mpeg' }));;

		} catch (e) {
			alert(e.message);
		}
	}, [ffmpegRef, audioRef])

	const onUrlPlayblack = (url: string) => {
		if (!url.trim()) return;
		onFFMPEgConversion(url);
	}

	const onUpload = (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		onFFMPEgConversion(file);
	}


	return (
		<main style={{ width: "100vw", height: "100vh" }}>
			{ffmpegLoaded ?
				<section style={{ display: "flex", flexDirection: "column", gap: 8, justifyContent: "center", alignItems: "center" }}>
					<label>Upload Audio</label>
					<input type="file" onChange={onUpload} accept='audio/*' />
					<label>Or Enter Audio URL</label>
					<input type="url" name="url" placeholder="Enter Audio URL" value={url} onChange={e => setURL(e.target.value)} />
					<button onClick={() => onUrlPlayblack(url)}>Convert and Play Audio URL</button>
					<audio controls ref={audioRef} />
				</section>
				:
				<div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>Loading...</div>
			}
		</main>
	)
}

export default App
