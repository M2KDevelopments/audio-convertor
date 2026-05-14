/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef, useState } from 'react'
// FFMPEG - https://ffmpegwasm.netlify.app/docs/getting-started/usage
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

function App() {

	const [ffmpegLoaded, setFFmpegLoaded] = useState(false);
	const ffmpegRef = useRef(new FFmpeg());
	const audioRef = useRef<HTMLAudioElement>(null);

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


	const onConvert = useCallback(async (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		const ffmpeg = ffmpegRef.current;
		try {
			await ffmpeg.deleteFile(`output.mp3`);
		} catch (err) {
			console.error(err);
		}
		await ffmpeg.writeFile('input.mp3', await fetchFile(file));
		const command = `-i input.mp3 output.mp3`.split(' ');
		await ffmpeg.exec(command);
		const data: any = await ffmpeg.readFile(`output.mp3`);
		if (audioRef.current) audioRef.current.src = URL.createObjectURL(new Blob([data], { type: 'audio/mpeg' }));;

	}, [ffmpegRef, audioRef])


	return (
		<main>
			{ffmpegLoaded ?
				<section>
					<input type="file" onChange={onConvert} />
					<audio controls ref={audioRef} />
				</section>
				:
				<div>Loading...</div>
			}
		</main>
	)
}

export default App
