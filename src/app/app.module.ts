import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './shared/inmemory-db/inmemory-db.service';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { KeycloakService } from './shared/services/keycloak/keycloak.service';
import { HttpTokenInterceptor } from './shared/services/interceptor/http-token-interceptor.service';
import { HelloService } from './shared/services/hello/hello.service';


export function kcFactory(kcService: KeycloakService) {
  return () => kcService.init();
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    SharedModule,
    HttpClientModule,
    BrowserAnimationsModule,
    InMemoryWebApiModule.forRoot(InMemoryDataService, { passThruUnknownUrl: true }),
    AppRoutingModule
  ],
  providers: [HttpClient,
    {
      provide:APP_INITIALIZER,
      deps: [KeycloakService],
      useFactory: kcFactory,
      multi:true
  },
  {
    provide: HTTP_INTERCEPTORS,
     useClass: HttpTokenInterceptor,
      multi: true 
  }

],
  bootstrap: [AppComponent]
})
export class AppModule { }
