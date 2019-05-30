import { Component, OnInit } from '@angular/core';
import { Adal6Service } from 'adal-angular6';

import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'WBG-UI';

  constructor(private adalSvc: Adal6Service) {
    this.adalSvc.init(environment.adalConfig);
  }

  ngOnInit() {
    this.adalSvc.handleWindowCallback();
  }
}



