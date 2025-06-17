export interface TinyUrlRequest {
  url: string;
  customAlias?: string;
}

export interface TinyUrlResponse {
  shortUrl: string;
  originalUrl: string;
  customAlias?: string;
}

export interface TinyUrlError {
  error: string;
  message: string;
}

export interface TinyURLSchema {
  url: string;
  shortUrl: string;
  createdAt?: Date;
}
