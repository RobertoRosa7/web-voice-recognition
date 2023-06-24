import {NgModule} from '@angular/core';
import {VoiceLibComponent} from './voice-lib.component';
import {CommonModule} from "@angular/common";
import {VoiceLibDirective} from './voice-lib-directive'

@NgModule({
  declarations: [VoiceLibComponent, VoiceLibDirective],
  imports: [CommonModule],
  exports: [VoiceLibComponent, VoiceLibDirective],
})
export class VoiceLibModule {
}
