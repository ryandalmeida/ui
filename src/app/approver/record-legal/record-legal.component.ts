import { Component, OnInit, ViewChild, Input, Inject, Output } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LegalData } from 'src/app/models/legal.model';
import { LegalService } from 'src/app/services/legal.service';
import { SelectionModel } from '@angular/cdk/collections';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatTabGroup } from '@angular/material';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { Adal6Service } from 'adal-angular6';		
import { environment } from 'src/environments/environment';
import { PledgeData } from 'src/app/models/pledge.model';
import { PagerService } from 'src/app/services/pagerService.service';

@Component({
  selector: 'app-record-legal',
  templateUrl: './record-legal.component.html',
  styleUrls: ['./record-legal.component.css']
})
export class RecordLegalComponent implements OnInit {
  searchForm = new FormGroup({
 /*    country: new FormControl(),
    pledgeFundType: new FormControl(),
    startDate: new FormControl(),
    endDate: new FormControl(),
    status: new FormControl(),
    donorName: new FormControl(),
    pledgeId: new FormControl(),
    donorSign: new FormControl(),
    wbgBusinessUserSign: new FormControl() */

    pledgeNo: new FormControl(),
    pledgeFundType: new FormControl(),
    startDate: new FormControl(),
    endDate: new FormControl(),
    programName: new FormControl(),
    paymentPeriod: new FormControl(),
    amount: new FormControl(),
    installments: new FormControl()

  });


  submitted = false;
  wbgBusinessUserSign: SignaturePad;
  displayedColumns: string[] = ['pledgeId', 'wbgProgram', 'pledgeType', 'donorName', 'country', 'amount', 'approver', 'startDate', 'endDate', 'status', 'recordlegalBtn',];
  dataSource: MatTableDataSource<PledgeData>;
  selection = new SelectionModel<LegalData>(true, []);
  isRowClicked: boolean = false;
  rowData;
  signImage;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  @Input() childMessage: boolean;
  recordLegalForm: FormGroup;
  authToken;
  private allItems: any[];
  pager: any = {};
  pagedItems: any[];

  constructor(private legalService: LegalService, public dialog: MatDialog, private formBuilder: FormBuilder, private http: HttpClient, private adalSvc: Adal6Service, private pagerService : PagerService) { }

pageload(){
  console.log("legal test")
  this.legalService.getAllLegalRecordedbyDonor().subscribe(
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
    donorSign: [''],
    wbgBusinessUserSign: ['', Validators.required]


  });
}



  ngOnInit() {

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
    console.log("row details", row, this.rowData)

    var legalFormData = this.rowData;

    this.legalService.getSign(legalFormData).subscribe(response => {
      console.log(response);   
     
  this.signImage=JSON.stringify(response).substr(2).slice(0, -2);
  console.log(this.signImage);
  
      }
      )}  
 
  onCancel() {
    this.isRowClicked = false;
    this.pageload();
  }

  selectRowBtn() {
    /* this.isRowClicked = true;
    this.rowData = row; */
    console.log("row details-BTN", this.rowData)
  }


  onLegalSubmit(row) {

    this.isRowClicked = true;
    this.rowData = row;
    console.log("legal submit clicked", row);
    this.recordLegalForm.value.pledgeId = row.pledgeId;
    this.recordLegalForm.value.wbgBusinessUserSign = this.signaturePad.toDataURL();
    console.log(this.signaturePad.toDataURL());

    if((this.signaturePad.toDataURL().length)>1600){

    var legalFormData = this.recordLegalForm.value;

    this.legalService.onLegalSubmitWBGUser(legalFormData).subscribe(response => {
      console.log("response",response);
      
      const dialogRef = this.dialog.open(LegalCreatedDialog, {
        data: response
        
      });
     
      dialogRef.afterClosed().subscribe(result => {
        this.isRowClicked = false;
    	  this.pageload();
        console.log('The dialog was closed');
      });
    }, (err: HttpErrorResponse) => {
      console.log(err);
    });
    
     
    this.recordLegalForm.reset();
    this.signaturePad.clear();

  }
  else{
    const dialogRef = this.dialog.open(LegalCreatedDialog, {
      data: 'Please sign the legal agreement'
    });

   
    this.signaturePad.clear();
  }
}

  searchLegal() {
    console.log("search clicked", this.searchForm.value);

    var searchFormData = this.searchForm.value;

    this.http.post("http://10.103.42.177:8000/pledge/search", searchFormData, { responseType: 'json' })
      .subscribe(response => {
        //debugger;
        console.log("search", response, typeof (response));
      }, (err: HttpErrorResponse) => {
        console.log(err);
      });
  }

}

@Component({
  selector: 'recordLegal.component',
  templateUrl: 'recordLegaldialog.component.html',
})
export class LegalCreatedDialog {
  constructor(
    public dialogRef: MatDialogRef<LegalCreatedDialog>,
    @Inject(MAT_DIALOG_DATA) public data) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onClick() {
    console.log("DATA", this.data);
    
    this.dialogRef.close();
    
  }
}








