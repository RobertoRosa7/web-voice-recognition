import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  private readonly api: string = environment.api;
  private readonly mlApi: string = environment.mlApi;

  constructor(private readonly http: HttpClient) {}

  public postAudio(audioBase64: string): Observable<{ keyword: string }> {
    return this.http.post<{ keyword: string }>(
      this.api + '/audio/send-audio',
      audioBase64
    );
  }

  public postAudioBlob(file: File): Observable<HttpEvent<void>> {
    const formData = new FormData();
    formData.set('file', file);

    return this.http.post<void>(`${this.mlApi}/audio-blob`, formData, {
      reportProgress: true,
      observe: 'events',
    });
  }
}
