import { Component, OnInit } from '@angular/core';
import { keys } from 'lodash';
import { ApiProxyService } from '../api-proxy.service';
import { Response } from '../domain/domains';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {

  private apiProxy: ApiProxyService;
  public responseResults: Response;
  public responseColumns: string[];

  constructor(apiProxy: ApiProxyService) {
    this.apiProxy = apiProxy;
  }

  ngOnInit() {
    this.apiProxy.subscribe(responseResults => {
      console.log("Result: " + this.responseResults);
      this.responseResults = responseResults;
      this.responseColumns = keys(responseResults[0]);
      console.log(this.responseColumns);
    });
  }

}
