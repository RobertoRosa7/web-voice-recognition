import { TestBed } from '@angular/core/testing';

import { VoiceLibService } from './voice-lib.service';

describe('VoiceLibService', () => {
  let service: VoiceLibService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VoiceLibService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
