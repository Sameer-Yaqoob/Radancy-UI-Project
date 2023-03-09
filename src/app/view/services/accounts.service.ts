import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { createAccount } from '../model/create-account.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {
  url = environment.apiUrl
  constructor(private http: HttpClient) { }

  createAccount(data:createAccount): Observable<any> {
    return this.http.post(this.url,data)
  }

  deleteAccount(id:number):Observable<any>{
    return this.http.delete(this.url +`/` + id)
  }

  getAccounts(): Observable<any>{
    return this.http.get(this.url)
   }

  getAccountById(id:number):Observable<any>{
    return this.http.get(this.url + `/` + id)
  }

  depositeBalance(id:number,data:createAccount){
    return this.http.put(this.url+ '/' + id,data)
  }

  withdrawBalance(id:number,data:createAccount){
    return this.http.put(this.url+ '/' + id,data)
  }


}
