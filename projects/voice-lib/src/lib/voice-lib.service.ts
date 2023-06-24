import {EventEmitter, Injectable, Output} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import * as speech from '@tensorflow-models/speech-commands';
import {SpeechCommandRecognizerResult} from '@tensorflow-models/speech-commands';
import "@tensorflow/tfjs";
import {StatusRecord} from "./voice-lib-status-record";

@Injectable({
  providedIn: 'root'
})
export class VoiceLibService {
  public names$: BehaviorSubject<Array<string>> = new BehaviorSubject<Array<string>>([]);
  public model!: speech.SpeechCommandRecognizer;
  public labels!: Array<string>;

  @Output()
  public listening: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  public stopListening: EventEmitter<StatusRecord> = new EventEmitter<StatusRecord>();


  constructor() {
    void this.loadModel();
    this.stopListening.emit(StatusRecord.STOPPED);
  }

  public async loadModel() {
    this.names$.subscribe((names) => console.log(names));
    const recognizer: speech.SpeechCommandRecognizer = speech.create("BROWSER_FFT");
    console.log("Model Loaded");

    await recognizer.ensureModelLoaded();
    this.model = recognizer;
    this.labels = recognizer.wordLabels();
  }

  public stopRecord() {
    void this.model.stopListening();
  }

  public async startRecord() {
    this.stopListening.emit(StatusRecord.STARTED);
    void await this.model.listen((result: SpeechCommandRecognizerResult): Promise<void> => {
      return new Promise<void>((resolve) => {
        this.listening.emit(this.labels[this.argMax(Object.values(result.scores))]);
        this.stopListening.emit(StatusRecord.RECORDING);
        resolve();
      });
    }, {includeSpectrogram: true, probabilityThreshold: 0.9});

    setTimeout(() => {
      this.stopRecord();
      this.stopListening.emit(StatusRecord.STOPPED);
    }, 10e3);
  }

  private argMax(arr: Array<number>) {
    return arr.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1]
  }
}
