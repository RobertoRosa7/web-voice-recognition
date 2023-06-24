import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoiceLibComponent } from './voice-lib.component';

describe('VoiceLibComponent', () => {
  let component: VoiceLibComponent;
  let fixture: ComponentFixture<VoiceLibComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoiceLibComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoiceLibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
