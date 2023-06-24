import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
    private readonly api: string = "http://localhost:8080";

  constructor(private readonly http: HttpClient) {}

  public postAudio(audioBase64: string): Observable<{keyword: string}> {
    return this.http.post<{keyword: string}>(this.api + "/audio/send-audio", audioBase64);
  }
}
