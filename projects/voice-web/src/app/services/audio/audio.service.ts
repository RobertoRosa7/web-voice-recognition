import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  private readonly api: string = environment.api;

  constructor(private readonly http: HttpClient) {}

  public postAudio(audioBase64: string): Observable<{ keyword: string }> {
    return this.http.post<{ keyword: string }>(
      this.api + '/audio/send-audio',
      audioBase64
    );
  }
}
