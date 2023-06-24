export enum eventType {
  AUDIO_LISTENING = 'audioListening',
  AUDIO_STOPPING = 'audioStopping',
  AUDIO_RECORDED = 'audiorecorded',
  AUDIO_TIMING = 'audiotiming',
}

export interface eventAudio {
  [eventType.AUDIO_LISTENING]: Function[];
  [eventType.AUDIO_STOPPING]: Function[];
  [eventType.AUDIO_RECORDED]: Function[];
  [eventType.AUDIO_TIMING]: Function[];
}

export class EventComponent {
  public events: eventAudio = {
    [eventType.AUDIO_LISTENING]: [],
    [eventType.AUDIO_STOPPING]: [],
    [eventType.AUDIO_RECORDED]: [],
    [eventType.AUDIO_TIMING]: [],
  };

  constructor() {}

  public on(eventName: eventType, fn: Function) {
    if (!this.events[eventName]) {
      this.events[eventName] = new Array();
    }

    this.events[eventName].push(fn);
  }

  public trigger(...args: any) {
    const eventName: eventType = args.shift();

    args.push(new Event(eventName));
    if (this.events[eventName] instanceof Array) {
      this.events[eventName].forEach((fn: Function) => {
        fn.apply(null, args);
      });
    }
  }
}
