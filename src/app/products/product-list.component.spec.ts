import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async, fakeAsync, tick } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ProductListComponent } from "./product-list.component";
import { ProductService } from './services/product-service';
import { SpinnerService } from 'src/app/shared/services/spinner-service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import * as Rx from 'rxjs';
import { delay } from "rxjs/operators";


describe("ProductListComponent", () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productService: ProductService;
  let spinnerService: SpinnerService;
  let matProgressSpinner: MatProgressSpinnerModule;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ProductListComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
        provide: ProductService,
        useClass: ProductService
      },
      {
        provide: SpinnerService,
        useClass: SpinnerService
      },
      {
        provide: MatProgressSpinnerModule,
        useClass: MatProgressSpinnerModule
      },
      {
        provide: MatDialog,
        useClass: MatDialog
      },
    ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    productService = TestBed.inject(ProductService);
    spinnerService = TestBed.inject(SpinnerService);
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(ProductListComponent);
    const component = fixture.debugElement.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit', () => {
    const fixture = TestBed.createComponent(ProductListComponent);
    const component = fixture.debugElement.componentInstance;
    let spy_getPostDetails = spyOn(component,"getProductList").and.returnValue([]);
    component.ngOnInit();
    expect(component.postDetails).toEqual([]);
  });

  it('should call getProductList and get response as array', fakeAsync(() => {
    const fixture = TestBed.createComponent(ProductListComponent);
    const component = fixture.debugElement.componentInstance;
    const service = fixture.debugElement.injector.get(ProductService);
    let spy_getPosts = spyOn(service,"GetProductList").and.callFake(() => {
      return Rx.of([]).pipe(delay(2000));
    });
    component.getProductList();
    tick(1000);
    expect(component.showLoadingIndicator).toEqual(true);
    tick(1000);
    expect(component.showLoadingIndicator).toEqual(false);
    expect(component.postDetails).toEqual([]);
  }));
})