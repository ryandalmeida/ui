import { Component, OnInit, ViewChild,Inject, Input } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ARData } from 'src/app/models/ar.model';
import { ARService } from 'src/app/services/AR.service';
import { SelectionModel } from '@angular/cdk/collections';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatTabGroup } from '@angular/material';
import { Adal6Service } from 'adal-angular6';

@Component({
  selector: 'app-initiate-ar',
  templateUrl: './initiate-ar.component.html',
  styleUrls: ['./initiate-ar.component.css']
})
export class InitiateArComponent implements OnInit {
  searchForm = new FormGroup({
    country: new FormControl(),
    ARFundType: new FormControl(),
    startDate: new FormControl(),
    endDate: new FormControl(),
    status: new FormControl(),
    donorName: new FormControl(),
    ar_no: new FormControl(),
    invoice_no: new FormControl()
  }); 


  displayedColumns: string[] = ['pledgeId', 'pledgeType', 'donorName', 'country', 'amount', 'approver', 'startDate', 'endDate','action'];
  dataSource: MatTableDataSource<ARData>;
   selection = new SelectionModel<ARData>(true, []);
   isRowClicked : boolean = false;
   rowData;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input() childMessage: boolean;
  initiateARForm: FormGroup;
  //searchForm: FormGroup;
  
  constructor(private ARService: ARService,public dialog: MatDialog, private formBuilder: FormBuilder, private http: HttpClient, private adalSvc: Adal6Service) { }

  ngOnInit() {
    //this.dataSource.paginator = this.paginator;
    console.log("testing")
    this.ARService.getAllAR().subscribe(
      (data) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (error) => {
        console.log("Error: " + error)
      });

      this.initiateARForm = this.formBuilder.group({
        pledgeId:[''],
        country: [''],
        accountNo: [''],
        bankName: [''],
        startDate: [''],
        endDate: [''],
        amount: [''],
        paymentPeriod: [''],
        installments: [''],
      });

      
 /*  this.searchForm = this.formBuilder.group({
    country: [''],
    ARFundType: [''],
    startDate: [''],
    endDate: [''],
    status: [''],
    donorName: [''],
    ar_no: [''],
    invoice_no: ['']
  }); */
  }

  selectRow(row){
    this.isRowClicked = true;
    this.rowData = row;
    console.log("row details", row, this.rowData)
  }

  onCancel(){
    this.isRowClicked = false;
  }

  onARSubmit(){
    //this.rowData
   // this.rowData.comments = "test";
   var row = this.rowData;
   this.initiateARForm.value.pledgeId =row.pledgeId;
   this.initiateARForm.value.country =row.country;
   this.initiateARForm.value.amount =row.amount;
   //this.initiateARForm.value.accNo =row.accNo;
   //this.initiateARForm.value.bankName =row.bankName;
   this.initiateARForm.value.paymentPeriod =row.paymentPeriod;
   this.initiateARForm.value.installments = row.installments;
   //this.initiateARForm.value.installmentsDue = 4;
   //this.initiateARForm.value.status =null;
   //this.initiateARForm.value.approver = null;
   //this.initiateARForm.value.donorId = null;
   this.initiateARForm.value.donorName = row.donorName;
   //this.initiateARForm.value.noOfPayment =row.installments;
   this.initiateARForm.value.startDate =row.startDate;
   this.initiateARForm.value.endDate =row.endDate;
    console.log(this.initiateARForm);
    var myPostObject = this.initiateARForm.value;
    console.log("myPostObject", myPostObject)

	 let options = {
	 headers: new HttpHeaders().set('Authorization',`${this.adalSvc.userInfo.token}`)		
	    };
    
   // this.http.post("https://5ufe1v6q92.execute-api.us-east-1.amazonaws.com/test/tasktokenpoller", myPostObject, options)
   this.http.post("http://localhost:8081/accountReceivable/submitAccountReceivable", myPostObject, options)  
   .subscribe(response => {
        console.log(response);
        const dialogRef = this.dialog.open(InitiateARDialog, {
          data: response
        });

        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
        });
      }, (err: HttpErrorResponse) => {
        console.log(err);
      });
      this.initiateARForm.reset();
  }


    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
      const numSelected = this.selection.selected.length;
      const numRows = this.dataSource.data.length;
      return numSelected === numRows;
    }
  
    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
      debugger;
      this.isAllSelected() ?
          this.selection.clear() :
          this.dataSource.data.forEach(row => {
            console.log("row",row)
            this.selection.select(row)
          });
    }
  
    /** The label for the checkbox on the passed row */
    checkboxLabel(row): string {
      if (!row) {
        return `{this.isAllSelected() ? 'select' : 'deselect'} all`;
      }
      return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.ARId + 1}`;
    }
  
    // store(){
    //   setTimeout(() => {
    //     //this.unselectedRows = this.selection.selected;
    //     console.log("unselectedRows: ", this.selection.selected);
    //     var myPostObject = this.selection.selected;
    //     this.http.post("http://10.103.42.177:8080/pledge/getLegalRecorded", myPostObject, { responseType: 'text' })
    //     .subscribe(response => {
    //       console.log(response);
    //     }, (err: HttpErrorResponse) => {
    //       console.log(err);
    //     });
  
    //   });
    // }
}

@Component({
  selector: 'app-initiate-dialog',
  templateUrl: './initiateardialog.component.html',
   styleUrls: ['./initiate-ar.component.css']
})
export class InitiateARDialog {
  constructor(
    public dialogRef: MatDialogRef<InitiateARDialog>,
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