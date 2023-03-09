import { Component, Input } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';
import { ActionType } from '../model/action-type.model';
import { createAccount } from '../model/create-account.model';
import { AccountsService } from '../services/accounts.service';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss']
})

export class CreateAccountComponent {

  bankAccountForm!: FormGroup;
  @Input() accountObj!:ActionType;
  button:string ="Create Account";
  title:string = "Create New Bank Account";
  totalBalance!:number;

  constructor(private fb: FormBuilder ,public activeModal: NgbActiveModal, private toastrService: ToastrService , private accountsService:AccountsService,private router: Router) { }

  ngOnInit() {
    if(this.accountObj.deposite || this.accountObj.withDraw){
      this.title = "Update Bank Account";
      this.button = "Update Account "
      this.accountsService.getAccountById(this.accountObj.id).pipe(map(result=>result.value.data)).subscribe((res:createAccount)=>{

        this.totalBalance= res.balance
        this.bankAccountForm = this.fb.group({
          id:new FormControl({value: res.id, disabled: true}),
          accountHolderName: new FormControl({value: res.accountHolderName, disabled: true}),
          accountNumber: new FormControl({value: res.accountNumber, disabled: true}),
          accountType: new FormControl({value: res.accountType, disabled: true}),
          ifscCode: new FormControl({value: res.ifscCode, disabled: true}),
          branchName: new FormControl({value: res.branchName, disabled: true}),
          balance: new FormControl({value: null, disabled: false}, [Validators.required ,Validators.min(100),Validators.pattern("^[0-9]*$"),
            Validators.max(10000)]),

        });
      });
    } else {
      this.bankAccountForm = this.fb.group({
        id:[1,Validators.required],
        accountHolderName: ['', Validators.required],
        accountNumber: ['', [Validators.required,Validators.pattern("^[0-9]*$")]],
        accountType: ['', Validators.required],
        ifscCode: ['', Validators.required],
        branchName: ['', Validators.required],
        balance: [null, [Validators.required ,Validators.min(100),Validators.pattern("^[0-9]*$"),
        Validators.max(10000)]]
      });
    }
  }


  isWithdrawalValid() {
     const formValue =   this.bankAccountForm.getRawValue()
      const withdrawalAmount = formValue.balance;
      return withdrawalAmount <= (this.totalBalance * 0.9)  && (this.totalBalance - withdrawalAmount >=100);
  }

  saveAccount(){
    const balance = this.bankAccountForm.get('balance')?.value;

   if(this.accountObj.deposite){
    this.bankAccountForm.get('balance')?.patchValue(this.totalBalance + balance);
    this.accountsService.depositeBalance(this.accountObj.id,this.bankAccountForm.getRawValue()).subscribe(res=>{
    this.toastrService.success('Deposite balance successfully ', 'Success');
    this.activeModal.close(res);
  });
}else if(this.accountObj.withDraw)
  {
    if (this.bankAccountForm.valid && this.isWithdrawalValid()) {
      this.bankAccountForm.get('balance')?.patchValue(this.totalBalance - balance);
      this.accountsService.withdrawBalance(this.accountObj.id,this.bankAccountForm.getRawValue()).subscribe(res=>{
      this.toastrService.success('withdraw successfully', 'Success');
      this.activeModal.close(res);
    })
}else{this.toastrService.error('Can not withdraw more than 90% amount', 'Error');}
    }
    else{
      this.accountsService.createAccount(this.bankAccountForm.value).subscribe(res=>{
        this.toastrService.success('Create Account Successfully!', 'Sucess');
        this.activeModal.close(res);
      })
    }
  }
  closeModal(){
    this.activeModal.close()
  }
}
