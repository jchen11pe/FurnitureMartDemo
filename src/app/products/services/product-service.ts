import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { IProduct } from '../models/product-model';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
    })
};

const baseAddr = "https://deloitteaustralia-dev.outsystemscloud.com/BPService/rest/Products/";

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    private errorMsg = 'Error in service method -- ';

    constructor(private http: HttpClient) { }

    private handleError(operation: string) {
        return (err: any) => {
            const errMsg = `error in ${operation}`;
            console.log('${errMsg}:', err);
            if (err instanceof HttpErrorResponse) {
                console.log(`status: ${err.status}, ${err.statusText}`);
            }
            return throwError(errMsg);
        };
    }

    public GetProductList(): Observable<IProduct[]> {
        return this.http.get<IProduct[]>(baseAddr + 'GetProductList').pipe(
            tap(data => console.log('server data:', data)),
            catchError(this.handleError('getRulesetData API'))
        );
    }
}