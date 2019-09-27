import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { StorageServiceModule } from 'angular-webstorage-service';

import { SearchFormComponent } from './search-form/search-form.component';
import { ResultComponent } from './result/result.component';
import { AppComponent } from './app.component';

import { ApiProxyService } from './api-proxy.service';

@NgModule({
  declarations: [
    AppComponent,
    SearchFormComponent,
    ResultComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    StorageServiceModule
  ],
  providers: [ApiProxyService],
  bootstrap: [AppComponent]
})
export class AppModule { }
