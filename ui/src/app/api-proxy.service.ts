import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, Subscription, Subject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { LOCAL_STORAGE, WebStorageService } from 'angular-webstorage-service';

import { Request, Response } from './domain/domains';


@Injectable()
export class ApiProxyService {

  private storage: WebStorageService;
  private http: HttpClient;
  private url = '/api/';
  private headers: HttpHeaders;

  private subject = new Subject<Response[]>();

  constructor(http: HttpClient, @Inject(LOCAL_STORAGE) storage: WebStorageService) {
    this.http = http;
    this.storage = storage;

    this.headers = new HttpHeaders();
    this.headers.append('Content-Type', 'application/json');
  }

  subscribe = (listener): Subscription => {
    return this.subject.subscribe(listener);
  }

  loadGroups = (): Observable<object[]> => {
    const selectedGroup = this.storage.get('ticket.calc.GROUP') || 'A';
    return this.http.get<object[]>(this.url + 'groups/', { headers: this.headers })
      .pipe(
        map(data => {
          return data.map(group => {
            return { group, isSelected: group === selectedGroup };
          });
        }),
        catchError(this.handleError)
      );
  }

  loadRoundTripFlag = (): boolean => {
    console.log(this.storage.get('ticket.calc.ROUNDTRIP'));
    return this.storage.get('ticket.calc.ROUNDTRIP');
  }

  /*
  Subscribe to response via subscribe method
   */
  search = (request: Request): void => {
    console.log(request);
    this.http.post<Response[]>(this.url, request)
      .pipe(
        map(data => data.map(item => item as Response)),
        catchError(this.handleError)
      )
      .subscribe(groups => {
        this.storage.set('ticket.calc.GROUP', request.group);
        this.storage.set('ticket.calc.ROUNDTRIP', request.isRoundTrip);
        console.log(request.isRoundTrip, this.storage.get('ticket.calc.ROUNDTRIP'));
        this.subject.next(groups);
      }, err => {
        console.log(err);
      });
  }

  private handleError(error: Response | any) {
    console.error(error.message);
    return Observable.throw(error.message || error);
  }
}
