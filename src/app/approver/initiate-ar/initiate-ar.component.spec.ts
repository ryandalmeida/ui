import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatToolbarModule,
  MatIconModule,
  MatSidenavModule,
  MatGridListModule,
  MatListModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule ,
  MatCheckboxModule
} from '@angular/material';
import { ReactiveFormsModule, FormsModule} from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Adal6HTTPService, Adal6Service } from 'adal-angular6';

import { InitiateArComponent } from './initiate-ar.component';
import { ARService } from '../../services/AR.service';


describe('InitiateArComponent', () => {
  let component: InitiateArComponent;
  let fixture: ComponentFixture<InitiateArComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InitiateArComponent ],
      imports: [
        MatToolbarModule,
  MatIconModule,
  MatSidenavModule,
  MatGridListModule,
  MatListModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  ReactiveFormsModule,
  FormsModule,
  BrowserAnimationsModule,
  HttpClientTestingModule,
  MatCheckboxModule ],
  providers: [ARService, Adal6Service, {
    provide: Adal6HTTPService,
    useFactory: Adal6HTTPService.factory,
    deps: [Adal6Service]
},]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InitiateArComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
