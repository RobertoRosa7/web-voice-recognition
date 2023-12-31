import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../../interfaces/product.interface';
import { environment } from '../../../../src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly api: string = environment.api;
  constructor(private readonly http: HttpClient) {}

  public all(): Observable<Array<Product>> {
    return this.http.get<Array<Product>>(`${this.api}/product/all`);
  }

  public findById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.api}/product/find-by-id/${id}`);
  }

  public findByName(name: string): Observable<Array<Product>> {
    return this.http.get<Array<Product>>(
      `${this.api}/product/find-by-name?name=${name}`
    );
  }

  public removeOne(prod: Product): Observable<any> {
    return this.http.delete<any>(`${this.api}/product/remove/${prod.id}`);
  }

  public create(prod: Product): Observable<void> {
    return this.http.post<void>(`${this.api}/product/create`, prod);
  }

  public edit(prod: Product): Observable<void> {
    return this.http.put<void>(`${this.api}/product/update`, prod);
  }
}
