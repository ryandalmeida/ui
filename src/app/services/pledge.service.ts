import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { PledgeData } from '../models/pledge.model';
import { Adal6Service } from 'adal-angular6';
import { environment } from '../../environments/environment';

@Injectable()
export class PledgeService {
  public serviceUrl = 'http://10.103.42.177:8000/pledge/getNew';
  result: PledgeData[] = [];
  authToken;
  constructor(private http: HttpClient, private adalSvc: Adal6Service) { }

  getAuthToken() {
    console.log("adal", this.adalSvc.userInfo)
    if (this.adalSvc.userInfo.authenticated) {
      console.log("authenticatedd : ", this.adalSvc.userInfo.authenticated)
      var authContext = new AuthenticationContext(environment.adalConfig);
      authContext.handleWindowCallback();
      this.adalSvc.acquireToken('b0f49dbf-f119-4483-9850-1c47b19235a5').subscribe(
        data => {
          console.log("inData", data);
          this.authToken = 'Bearer ' + data;
        })
    }
  }

  getAllPledge(): Observable<PledgeData[]> {
    this.getAuthToken();
    console.log("this.authToken",this.authToken)
    let options = {
      headers: new HttpHeaders().set('Authorization', this.authToken)
    };
    return this.http.get<PledgeData[]>('https://wbg-bpm-apim.azure-api.net/pledge-api/pledge/getNew', options);
  }

  submitPledge(myPostObject): Observable<Object> {
    let options = {
      headers: new HttpHeaders().set('Authorization', `${this.adalSvc.userInfo.token}` )
    };
    return this.http.post("https://5ufe1v6q92.execute-api.us-east-1.amazonaws.com/test/initiator-lambda", myPostObject, options)
  }

  searchPledge(myPostObject) {
    this.getAuthToken();
    let options = {
      headers: new HttpHeaders().set('Authorization', this.authToken)
    };
    return this.http.post("https://wbg-bpm-apim.azure-api.net/pledge-api/pledge/search", myPostObject, options)
  }

  approvePledge(myPostObject) {
    let options = {
      headers: new HttpHeaders().set('Authorization', `${this.adalSvc.userInfo.token}`)
    };
    return this.http.post("https://5ufe1v6q92.execute-api.us-east-1.amazonaws.com/test/tasktokenpoller", myPostObject, options)
  }

  revisePledge(myPostObject) {
    this.getAuthToken();
    let options = {
      headers: new HttpHeaders().set('Authorization', this.authToken).set('responseType', 'text')
    };
    return this.http.post("https://wbg-bpm-apim.azure-api.net/pledge-api/pledge/revise", myPostObject, options)
  }
}