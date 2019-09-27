export class Request {
   group: string;
   month: number;
   year: number;
   skip: number[];
   isRoundTrip: boolean;

   constructor() {
   }
}

export class Response {
  type: string;
  price: number;
  description: string;
}
