# Audio Converter
A lightweight, efficient tool that leverages the power of FFmpeg to convert various audio formats into MP3. This ensures your audio files are compatible with almost any modern media player, mobile device, or web browser.

## 🚀 Features
FFmpeg Powered: Uses industry-standard processing for high-fidelity audio conversion.

MP3 Optimization: Automatically converts files to MP3 format for maximum playability.

Simple Workflow: Streamlined process to go from raw audio to a playable file in seconds.

Cross-Format Support: Convert from WAV, AAC, OGG, FLAC, and more.


## 📦 Installation
Clone the repository and install the dependencies:

```bash
git clone https://github.com/M2KDevelopments/audio-convertor.git
cd audio-convertor
npm install  # Or the relevant install command for your project
```


## How it Works
The application takes your source file and passes it through an FFmpeg pipeline.

FFmpeg decodes the source audio stream and re-encodes it using the libmp3lame codec, which is the gold standard for MP3 compression. This process preserves as much audio detail as possible while significantly reducing file size.

## 🔧 Configuration
You can adjust the output quality by modifying the bitrate settings in the configuration:

Standard: 128kbps (Good for voice)

High Quality: 192kbps (Standard for music)

Extreme: 320kbps (Best for audiophiles)

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## Fork the Project

Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'Add some AmazingFeature')

Push to the Branch (git push origin feature/AmazingFeature)

Open a Pull Request

## 📄 License
Distributed under the MIT License. See LICENSE for more information.

Developed by M2K Developments
