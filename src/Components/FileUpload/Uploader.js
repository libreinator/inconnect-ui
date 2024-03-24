import WaveSurfer from 'wavesurfer.js';
import { useEffect, useRef, useState } from 'react';
import './uploader.css';
import upload from './upload.svg';

const Uploader = () => {
    const [audioSrc, setAudioSrc] = useState(null);
    const waveformRef = useRef(null);
    const wavesurferRef = useRef(null);

    useEffect(() => {
        if (audioSrc) {
            const wavesurfer = WaveSurfer.create({
                container: waveformRef.current,
                waveColor: 'black',
                progressColor: 'gray',
                cursorWidth: 0,
                barWidth: 2,
                barRadius: 2,
            });
            wavesurfer.load(audioSrc);
            wavesurferRef.current = wavesurfer;
        }
    }, [audioSrc]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const fileType = file.type.split('/')[0];
            if (fileType === 'audio') {
                const reader = new FileReader();
                reader.onload = (event) => {
                    setAudioSrc(event.target.result);
                };
                reader.readAsDataURL(file);
            } else {
                alert('Please upload an audio file.');
            }
        }
    };


    const handleUpload = () => {
        console.log("Uploading audio:", audioSrc);
    };

    const handlePlayPause = () => {
        if (wavesurferRef.current) {
            wavesurferRef.current.playPause();
        }
    };

    const handleCancel = (e) => {
        e.preventDefault();
        setAudioSrc(null);
        if (wavesurferRef.current) {
            wavesurferRef.current.destroy();
        }
    };



    const handleProceed = () => {
        // Proceed with uploaded audio
    };

    return (
        <div className='hero'>
            <h1 className='convert-text'>Convert</h1>
            <p className='convert-paragraph'>Convert speech to sign language easily</p>
            <label htmlFor="input-file" id="drop-area">
                <input
                    type="file"
                    accept="audio/*"
                    id="input-file"
                    hidden
                    onChange={handleFileChange}
                />
                <div id="audio-play">
                    {audioSrc ? (
                        <>
                            <div className="container-1">
                                <button onClick={handlePlayPause} className='btn'>Play/Pause</button>
                                <button onClick={(e) => handleCancel(e)} className='btn'>Cancel</button>
                            </div>

                            {audioSrc && (
                                <div id="audio-preview">
                                    <div ref={waveformRef} id="waveform" />
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <img src={upload} alt="upload" />
                            <p>Drag and drop or click here<br />to upload audio</p>
                            <span>Upload Audio</span>
                        </>
                    )}
                </div>
            </label>
            <button onClick={handleProceed} className='btn-2'>Convert</button>
        </div>
    );
};

export default Uploader;
