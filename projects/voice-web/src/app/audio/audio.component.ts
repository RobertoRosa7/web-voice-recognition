import { EventComponent, eventType } from './event.component';
import RecordRTC from 'recordrtc';

export class AudioComponent extends EventComponent {
  public available: boolean = false;
  // public mimeType: string = "audio/ogg;codecs=opus";
  public mimeType: RecordRTC.Options['mimeType'] = 'audio/wav';
  public stream!: MediaStream;
  public mediaRecorder!: MediaRecorder;
  public recordMicrophoneInterval: any;
  private recorder!: RecordRTC.StereoAudioRecorder;
  private readonly filename = `mic${Date.now()}.wav`;

  constructor() {
    super();

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream: MediaStream) => {
        this.available = true;
        this.stream = stream;
        this.trigger(eventType.AUDIO_LISTENING, this.stream);
      });
  }

  public get isAvailable(): boolean {
    return this.available;
  }

  public startRecorderRTC(): void {
    console.log('audio starting recording');
    if (this.available) {
      this.recorder = new RecordRTC.StereoAudioRecorder(this.stream, {
        type: 'audio',
        mimeType: this.mimeType,
      });
      this.recorder.record();
    }
  }

  public stopAudioRecorderRTC(): void {
    if (this.available) {
      this.recorder.stop((blob: Blob) => {
        const file: File = new File([blob], this.filename, {
          type: this.mimeType,
          lastModified: Date.now(),
        });
        this.trigger(eventType.AUDIO_RECORDED, file)
        this.stop();
      });
    }
  }

  public startRecorder(): void {
    console.log('audio starting recording');
    if (this.isAvailable) {
      this.mediaRecorder = new MediaRecorder(this.stream);

      const recorderChunks: BlobPart[] = [];
      this.mediaRecorder.addEventListener('dataavailable', ({ data }) => {
        if (data.size > 0) {
          recorderChunks.push(data);
        }
      });

      this.mediaRecorder.addEventListener('stop', () => {
        const blob: Blob = new Blob(recorderChunks, { type: this.mimeType });
        const audioContext = new AudioContext();
        const reader = new FileReader();

        reader.onload = () => {
          const data = reader.result as ArrayBuffer;

          audioContext.decodeAudioData(data).then((decode) => {
            const file: File = new File([blob], this.filename, {
              type: this.mimeType,
              lastModified: Date.now(),
            });
            this.trigger(eventType.AUDIO_RECORDED, file, decode);
          });
        };
        reader.readAsArrayBuffer(blob);
      });

      this.mediaRecorder.start();
      this.startTimer();
    }
  }

  public stopRecorder(): void {
    if (this.isAvailable) {
      this.mediaRecorder.stop();
      this.stop();
      this.stopTimer();
    }
  }

  public stop(): void {
    console.log('audio stopping recording');
    this.stream.getTracks().forEach((track) => {
      track.stop();
    });
  }

  public startTimer(): void {
    const start = Date.now();
    this.recordMicrophoneInterval = setInterval(() => {
      this.trigger(eventType.AUDIO_TIMING, Date.now() - start);
    }, 100);
  }

  public stopTimer(): void {
    clearInterval(this.recordMicrophoneInterval);
  }
}
