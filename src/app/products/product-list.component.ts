import { Component, OnInit, Inject } from '@angular/core';
import { IProduct } from './models/product-model';
import { ProductService } from './services/product-service';
import { SpinnerService } from 'src/app/shared/services/spinner-service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
    selector: 'product-list-component',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
    public productList: IProduct[];
    public filteredProductList: IProduct[];
    public selectedProduct: IProduct;
    public types: string[];
    public materials: string[];
    public lastKeypress: number = 0;
    public queryText: string = '';
    public filterOpen: boolean = false;
    public typeFilter: string = '';
    public materialFilter: string = '';
    public isSaleFilter: boolean;
    public maxPriceFilter: number;
    public minPriceFilter: number;

    constructor(private productService: ProductService, public spinnerService: SpinnerService, private sp: MatProgressSpinnerModule, public dialog: MatDialog) { }

    ngOnInit() {
        this.getProductList();
    }

    getProductList() {
        try {
            this.productService.GetProductList().subscribe((products: IProduct[]) => {
                //check if response has data 
                if (products) {
                    this.productList = products;
                    this.filteredProductList = products;
                    this.types = [...new Set(products.map(x => x.Type))];
                    this.materials = [...new Set(products.map(x => x.ProductName.split('| ').pop()))];
                } else {
                    throw console.error("this.periods is empty");
                }
            }), (error: any) => console.log(error),
                () => console.log("error in method -- async getProducts");
        } catch (error) {
            console.log("error in method -- getProducts");
        }

        this.productService.GetProductList().pipe
    }

    searchProducts($event) {
        if ($event.timeStamp - this.lastKeypress > 100) {
            this.queryText = $event.target.value.toLowerCase().trim();
            this.filterProducts();
        }
        this.lastKeypress = $event.timeStamp;
    }

    minPriceChange($event) {
        if ($event.timeStamp - this.lastKeypress > 100) {
            this.minPriceFilter = $event.target.value.trim();
            this.filterProducts();
        }
        this.lastKeypress = $event.timeStamp;
    }

    maxPriceChange($event) {
        if ($event.timeStamp - this.lastKeypress > 100) {
            this.maxPriceFilter = $event.target.value.trim();
            this.filterProducts();
        }
        this.lastKeypress = $event.timeStamp;
    }

    filterProducts() {
        console.log('min: ' + this.minPriceFilter);
        this.filteredProductList = this.productList.filter(x => {
            if (this.queryText != '' &&
                (!(this.queryText.includes(' ') && (this.queryText.split(' ').some(q => x.ProductName.toLowerCase().includes(q) || x.Type.toLowerCase().includes(q)))) &&
                    !(!this.queryText.includes(' ') && (x.ProductName.toLowerCase().includes(this.queryText) || x.Type.toLowerCase().includes(this.queryText))))) {
                return false;
            }
            if (this.typeFilter != '' && !x.Type.toLowerCase().includes(this.typeFilter.toLowerCase())) {
                return false;
            }
            if (this.materialFilter != '' && !x.ProductDetails.toLowerCase().includes(this.materialFilter.toLowerCase())) {
                return false;
            }
            if (this.materialFilter != '' && !x.ProductDetails.toLowerCase().includes(this.materialFilter.toLowerCase())) {
                return false;
            }
            if (this.minPriceFilter && +x.Price < this.minPriceFilter) {
                return false;
            }
            if (this.maxPriceFilter && +x.Price > this.maxPriceFilter) {
                return false;
            }
            if (this.isSaleFilter && x.IsSale != this.isSaleFilter) {
                return false;
            }
            return true;
        });
    }

    openDialog(product: IProduct) {
        this.selectedProduct = product;
        this.dialog.open(ProductDialogComponent, {
          data: this.selectedProduct
        });
      }
}

@Component({
    selector: 'product-dialog-component',
    templateUrl: './product-dialog.component.html'
})
export class ProductDialogComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public product: IProduct) { }
}