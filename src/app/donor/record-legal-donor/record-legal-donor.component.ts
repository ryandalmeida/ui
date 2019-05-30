import { Component, OnInit, ViewChild, Input, Inject, Output } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LegalData } from 'src/app/models/legal.model';
import { LegalService } from 'src/app/services/legal.service';
import { SelectionModel } from '@angular/cdk/collections';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatTabGroup } from '@angular/material';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { packageNonAnimatableStyles } from '@angular/animations/browser/src/render/special_cased_styles';
import { ɵangular_packages_platform_browser_dynamic_platform_browser_dynamic_a } from '@angular/platform-browser-dynamic';
import { Adal6Service } from 'adal-angular6';
import { PledgeData } from 'src/app/models/pledge.model';
import { PagerService } from 'src/app/services/pagerService.service';
@Component({
  selector: 'app-record-legal-donor',
  templateUrl: './record-legal-donor.component.html',
  styleUrls: ['./record-legal-donor.component.css']
})
export class RecordLegalComponentDonor implements OnInit {
 

  submitted = false;
  wbgBusinessUserSign: SignaturePad;
  displayedColumns: string[] = ['pledgeId', 'wbgProgram', 'pledgeType', 'donorName', 'country', 'amount', 'approver', 'startDate', 'endDate', 'status', 'recordlegalBtn',];
  dataSource: MatTableDataSource<PledgeData>;
  selection = new SelectionModel<LegalData>(true, []);
  isRowClicked: boolean = false;
  rowData;
 

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  @Input() childMessage: boolean;
  recordLegalForm: FormGroup;
  searchForm: FormGroup;
  private allItems: any[];
  pager: any = {};
  pagedItems: any[];


  constructor(private legalService: LegalService, public dialog: MatDialog, private formBuilder: FormBuilder, private http: HttpClient,  private adalSvc: Adal6Service, private pagerService : PagerService) { }

pageload(){

  this.searchForm = this.formBuilder.group({
    pledgeNo: [''],
    pledgeFundType: [''],
    startDate: [''],
    endDate: [''],
    programName: [''],
    paymentPeriod: [''],
    amount: [''],
    installments:['']

  });

  this.legalService.getAllLegalrecords().subscribe(
    (data) => {
      this.allItems = data;
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.setPage(1);
    },
    (error) => {
      console.log("Error: " + error)
    });

  this.recordLegalForm = this.formBuilder.group({
    pledgeId: [''],
    donorName: [''],
    wbg_program: [''],
    country: [''],
    pledgeFundType: [''],
    startDate: [''],
    endDate: [''],
    amount: [''],
    paymentPeriod: [''],
    noOfPayment: [''],
    donorSign: ['',Validators.required],
    wbgBusinessUserSign: ['']
  });
}
  ngOnInit() {
    console.log("childmsg legal", this.childMessage);
   this.pageload(); 
  }

  setPage(page: number) { 
    if (page < 1 || page > this.pager.totalPages) {
        return;
    }

    // get pager object from service
    this.pager = this.pagerService.getPager(this.allItems.length, page);

    // get current page of items
    this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
}

  selectRow(row) {
    this.isRowClicked = true;
    this.rowData = row;
    console.log("row details", row, this.rowData);
   }
      
  onCancel() {
    this.isRowClicked = false;
    this.pageload();
  }

  selectRowBtn() {
   	console.log("row details-BTN", this.rowData)
    console.log("1")
  }

  onLegalSubmit(row) {
    this.isRowClicked = true;
    this.rowData = row;
    console.log("legal submit clicked", row);
    this.recordLegalForm.value.pledgeId = row.pledgeId;
    this.recordLegalForm.value.donorName = row.donorName;
    this.recordLegalForm.value.donorSign = this.signaturePad.toDataURL();

    console.log("donor sign"+this.signaturePad.toDataURL());

    if((this.signaturePad.toDataURL().length)>1600){
    var legalFormData = this.recordLegalForm.value;
    
    let options = {		
      headers: new HttpHeaders().set('Authorization',`${this.adalSvc.userInfo.token}`)		
    };
   
    this.legalService.onLegalSubmitDonor (legalFormData) 
    .subscribe(response => {
        console.log(response);
        const dialogRef = this.dialog.open(LegalCreatedDialogDonor, {
          data: response
        });

        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
          this.isRowClicked = false;
    	  this.pageload();
        }); 
      }, (err: HttpErrorResponse) => {
        console.log(err);
        this.isRowClicked = false;
    this.pageload();
      });
    this.recordLegalForm.reset();
    this.signaturePad.clear();  
  }
  else{
    const dialogRef = this.dialog.open(LegalCreatedDialogDonor, {
      data: 'Please sign the legal agreement'
    });

    this.signaturePad.clear();
  }
}

  searchLegal() {
    console.log("search clicked", this.searchForm.value);
    var searchFormData = this.searchForm.value;
    this.legalService.search(searchFormData) 
      .subscribe(response => {
        console.log("search", response, typeof (response));
      }, (err: HttpErrorResponse) => {
        console.log(err);
      });
  }
}

@Component({
  selector: 'recordLegal.component',
  templateUrl: 'recordLegaldialog-donor.component.html',
})
export class LegalCreatedDialogDonor {
  constructor(
    public dialogRef: MatDialogRef<LegalCreatedDialogDonor>,
    @Inject(MAT_DIALOG_DATA) public data) {
  }
  onClick() {
    console.log("DATA", this.data);
    this.dialogRef.close();

    
  }
}








