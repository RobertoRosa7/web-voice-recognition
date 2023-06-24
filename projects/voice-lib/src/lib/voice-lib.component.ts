import {Component, OnInit} from '@angular/core';
import * as speech from '@tensorflow-models/speech-commands';
import {SpeechCommandRecognizerResult} from '@tensorflow-models/speech-commands';
import "@tensorflow/tfjs";

@Component({
  selector: 'lib-voice-lib',
  template: `
    <section>
      <p>voice-lib works!</p>
      <button (click)="recognizeCommands()">command</button>
      <span *ngIf="action">{{action}}</span>
      <span *ngIf="!action">No Action Detected!</span>
    </section>
  `,
  styles: []
})
export class VoiceLibComponent implements OnInit {
  public model!: speech.SpeechCommandRecognizer;
  public action!: string;
  public labels!: Array<string>;

  constructor() {
  }

  ngOnInit() {
    void this.loadModel();
  }

  public async loadModel() {
    const recognizer: speech.SpeechCommandRecognizer = speech.create("BROWSER_FFT");
    console.log("Model Loaded");

    await recognizer.ensureModelLoaded();
    this.model = recognizer;
    this.labels = recognizer.wordLabels();
  }

  public async recognizeCommands() {
    console.log("Listening for command");

    await this.model.listen((result: SpeechCommandRecognizerResult): Promise<void> => {
      return new Promise<void>((resolve) => {
        this.action = this.labels[this.argMax(Object.values(result.scores))];
        resolve();
      });
    }, {includeSpectrogram: true, probabilityThreshold: 0.9});

    setTimeout(() => {
      this.model.stopListening();
      this.action = '';
    }, 10e3);
  }

  private argMax(arr: Array<number>) {
    return arr.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1]
  }

}
