import {Directive, Input, OnInit} from "@angular/core";
import {VoiceLibService} from "./voice-lib.service";


@Directive({
  selector: '[v-names]',
})
export class VoiceLibDirective implements OnInit {
  @Input() wordlist: Array<string> = [];

  constructor(
    private readonly voiceService: VoiceLibService
  ) {
  }

  ngOnInit() {
    this.voiceService.names$.next(this.wordlist);
  }

}
