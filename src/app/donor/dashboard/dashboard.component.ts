import { Component, OnInit, Input, ViewChild, Inject, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { MatPaginator, MatSort, MatTableDataSource, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';

import { PledgeService } from '../../services/pledge.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { DataSource } from '@angular/cdk/collections';
import { PledgeData } from '../../models/pledge.model';
import { Adal6Service } from 'adal-angular6';
import { jsonpCallbackContext } from '@angular/common/http/src/module';
import { environment } from '../../../environments/environment';
import { PagerService} from '../../services/pagerService.service';
import * as _ from 'underscore';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  searchForm : FormGroup;
  registerForm: FormGroup;
  submitted = false;
  displayedColumns: string[] = ['pledgeId', 'programName', 'pledgeFundType', 'amount', 'installments', 'paymentPeriod', 'startDate', 'endDate'];
  dataSource: MatTableDataSource<PledgeData>;
  createPledgeClicked: boolean = false;
 // @Output() loggedIn = new EventEmitter<PledgeData>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() childMessage: boolean;
  @ViewChild(MatSort) sort: MatSort;
  private allItems: any[];
  pager: any = {};
  pagedItems: any[];
  lastPage : number;
  constructor(private pledgeService: PledgeService, private http: HttpClient, private formBuilder: FormBuilder, private adalSvc: Adal6Service, public dialog: MatDialog, private pagerService : PagerService) { }
  pageload() {
    this.pledgeService.getAllPledge().subscribe(
      (data) => {
        this.allItems = data;
        console.log(data)
        //this.dataSource = new MatTableDataSource(data);
        //this.dataSource.paginator = this.paginator;
        //this.dataSource.sort = this.sort;
        this.setPage(1);
      },
      (error) => {
        console.log("Error: " + error)
      });

  }
  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      country: ['', Validators.required],
      programName: ['', Validators.required],
      pledgeFundType: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      amount: ['', Validators.required],
      paymentPeriod: ['', Validators.required],
      installments: ['', Validators.required]
    });
    this.searchForm = this.formBuilder.group({
      pledgeNo: [''],
      pledgeFundType: [''],
      startDate: [''],
      endDate: [''],
      programName:[''],
      paymentPeriod: [''],
      amount: [''],
      installments: [''],
    });
    console.log("childmsg dashboard", this.childMessage);
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
    console.log("this.pagedItems", this.pagedItems)
    this.dataSource = new MatTableDataSource(this.pagedItems);
    this.dataSource.sort = this.sort;
}

  createPledge() {
    this.createPledgeClicked = true;
  }

  onCancel() {
    this.createPledgeClicked = false;
  }

  get f() {
    return this.registerForm.controls;
  }

  searchPledge() {
    console.log("search clicked", this.searchForm.value);

    var searchFormData = this.searchForm.value;

    this.pledgeService.searchPledge(searchFormData).subscribe(response => {
      console.log("search", response, typeof (response));
    }, (err: HttpErrorResponse) => {
      console.log(err);
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }

    console.log("my object ", this.registerForm.value);

    var myPostObject = this.registerForm.value;

    this.pledgeService.submitPledge(myPostObject).subscribe(response => {
      console.log(response.toString());
      const dialogRef = this.dialog.open(PledgeCreatedDialog, {
        data: response
      }); 
      dialogRef.afterClosed().subscribe(result => {
        this.createPledgeClicked = false;
        this.pageload();
        console.log('The dialog was closed');
      });
    }, (err: HttpErrorResponse) => {
        console.log(err);
      });

    this.registerForm.reset();
  }
};

@Component({
  selector: 'pledgeCreated.component',
  templateUrl: 'pledgeCreated.component.html',
})
export class PledgeCreatedDialog {
  constructor(
    public dialogRef: MatDialogRef<PledgeCreatedDialog>,
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
