export interface RequestData {
  method: string;
  url: string;
  headers: Record<string, string>;
  body: string;
}

export interface ResponseData {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
}

export interface RequestDataWithLink extends RequestData {
  link: string;
}
