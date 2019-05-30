import { Injectable }   from '@angular/core';
import { HttpClient, HttpHeaders }   from '@angular/common/http';
import { Observable }   from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { ARData } from '../models/ar.model';
import { Adal6Service } from 'adal-angular6';
import { environment } from 'src/environments/environment';
@Injectable()
export class ARService {
  // public serviceUrl = 'https://wbg-bpm-apim.azure-api.net/pledge-api/pledge/getLegalRecordedByApprover';
  public serviceUrl = 'http://localhost:8000/pledge/getLegalRecordedByApprover';
  result : ARData[]=[];
  authToken;
  constructor(private http: HttpClient, private adalSvc: Adal6Service) { }
  
  getAllAR(): Observable<ARData[]> {
    /* if(this.adalSvc.userInfo.authenticated){
       console.log("authenticatedd : ",this.adalSvc.userInfo.authenticated)
       var authContext = new AuthenticationContext(environment.adalConfig);
      authContext.handleWindowCallback();
      this.adalSvc.acquireToken('b0f49dbf-f119-4483-9850-1c47b19235a5').subscribe(
        data=>{
         console.log("DTAA", data);
          this.authToken = 'Bearer '+data;
        }) 
     }  */

    let options = {
      headers: new HttpHeaders().set('Authorization',this.authToken)
    }; 
  
       return this.http.get<ARData[]>(this.serviceUrl, options);
  }


}