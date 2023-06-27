export interface Product {
  id?: number;
  name: string;
  price: number;
  createdAt?: string;
}

export interface SearchResponse {
  keyword: string;
}
