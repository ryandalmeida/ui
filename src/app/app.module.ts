import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
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
  MatSortModule,
  MatCheckboxModule,
  MatRadioModule, 
  MatTooltipModule,
  MatProgressSpinnerModule
} from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent, PledgeCreatedDialog } from './donor/dashboard/dashboard.component';
import { RecordLegalComponentDonor, LegalCreatedDialogDonor } from './donor/record-legal-donor/record-legal-donor.component';
import { PledgeService } from './services/pledge.service';
import { LegalService } from './services/legal.service';
import { DonorHomeComponent } from './donor/donor-home/donor-home.component';
import { ApproverHomeComponent } from './approver/approver-home/approver-home.component';
import { ApprovePledgeComponent, ApproveDialog, RevisePledegDialog } from './approver/approve-pledge/approve-pledge.component';
import { RecordLegalComponent, LegalCreatedDialog } from './approver/record-legal/record-legal.component';
import { SignaturePadModule } from 'angular2-signaturepad';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { Adal6HTTPService, Adal6Service } from 'adal-angular6';
import { AuthenticationGuard } from './common/guards/authentication-guard';
import { Http, HttpModule } from '@angular/http';
import { ARService } from './services/AR.service';
import { InitiateArComponent, InitiateARDialog } from './approver/initiate-ar/initiate-ar.component';
import { UserRoleComponent } from './user-role/user-role.component';
import { UserRoleService } from './services/userRole.service';
import { ProcessPaymentComponent } from './payment/process-payment/process-payment.component';
import { PaymentService } from './services/payment.service';
import { ProcessInvoiceService } from './services/process-invoice.service'
import { ProcessInvoiceDialog } from './donor/process-invoice/process-invoice.component';
import { GenerateBillingComponent, BillCreatedDialog } from './approver/generate-billing/generate-billing.component';
import { BillingService } from './services/billing.service';
import { ProcessInvoiceComponent } from './donor/process-invoice/process-invoice.component';
import { PagerService } from './services/pagerService.service';

@NgModule({
  declarations: [
    AppComponent,
    PledgeCreatedDialog,
    DashboardComponent,
    DonorHomeComponent,
    ApproverHomeComponent,
    ApprovePledgeComponent,
    ApproveDialog,
    RevisePledegDialog,
    RecordLegalComponent,
    LegalCreatedDialog,
    RecordLegalComponentDonor,
    LegalCreatedDialogDonor,
    LoginComponent,
    LogoutComponent,
    InitiateArComponent,
    InitiateARDialog,
    UserRoleComponent,
    ProcessPaymentComponent,
    GenerateBillingComponent,
    BillCreatedDialog,
    ProcessInvoiceComponent,
    ProcessInvoiceDialog,
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatGridListModule,
    MatListModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    HttpClientModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule,
    SignaturePadModule,
    MatRadioModule,
    MatTooltipModule,
    MatProgressSpinnerModule
  ],
  providers: [PledgeService, ARService, LegalService, UserRoleService, PaymentService, Adal6Service, BillingService, ProcessInvoiceService,
    {
      provide: Adal6HTTPService,
      useFactory: Adal6HTTPService.factory,
      deps: [Http, Adal6Service]
    },
    AuthenticationGuard,
    PagerService

  ],

  bootstrap: [AppComponent],
  entryComponents: [PledgeCreatedDialog, LegalCreatedDialog, LegalCreatedDialogDonor, InitiateARDialog, ApproveDialog, BillCreatedDialog, ProcessInvoiceDialog, RevisePledegDialog],
})
export class AppModule { }
