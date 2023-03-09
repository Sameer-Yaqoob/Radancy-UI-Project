import { AfterViewInit, Component, DebugElement, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';
import { CreateAccountComponent } from '../create-account/create-account.component';
import { createAccount } from '../model/create-account.model';
import { AccountsService } from '../services/accounts.service';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements AfterViewInit , OnInit {


  displayedColumns: string[] = ['accountHolderName', 'accountNumber', 'accountType', 'ifscCode','balance','action'];
  dataSource = new MatTableDataSource<createAccount[]>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private modalService: NgbModal, private accountsService: AccountsService , private toastrService: ToastrService ){}

ngOnInit(): void {
this.loadAccounts();
}

  loadAccounts(){
  this.accountsService.getAccounts().pipe(map(result=>result.value.data)).subscribe(res=>{
    this.dataSource  = new MatTableDataSource(res);
  });
  }

  ngAfterViewInit() {
   this.dataSource.paginator = this.paginator;
  }

  createAccount(){
    const modalRef = this.modalService.open(CreateAccountComponent);
   let accountObj= {
    deposite:false
  }
   modalRef.componentInstance.accountObj = accountObj;
   modalRef.result.then(res=>{
    this.loadAccounts()
  }).catch(error => {
    console.error('An error occurred:', error);
  });
  }

  deleteAccount(id:number){
    this.accountsService.deleteAccount(id).subscribe(res=>{
      this.loadAccounts();
      this.toastrService.success('Delete account Successfully!', 'Success!');
    });
  }

  depositeAccount(id:number){
    const modalRef = this.modalService.open(CreateAccountComponent);
    let accountObj= {
      id:id,
      deposite:true
    }

    modalRef.componentInstance.accountObj = accountObj;
    modalRef.result.then(res=>{
      this.loadAccounts()
    }).catch(error => {
      console.error('An error occurred:', error);
    });

  }

  withdrawAccount(id:number){
    const modalRef = this.modalService.open(CreateAccountComponent);
    let accountObj= {
      id:id,
      withDraw:true
    }
    modalRef.componentInstance.accountObj = accountObj;
    modalRef.result.then(res=>{
      this.loadAccounts()
    }).catch(error => {
      console.error('An error occurred:', error);
    });

}
}

