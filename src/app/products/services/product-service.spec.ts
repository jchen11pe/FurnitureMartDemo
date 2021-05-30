import { TestBed } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { ProductService } from "./product-service";

describe("ProductService", () => {
  let productService: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: ProductService,
          useClass: ProductService
        }
      ]
    });
    productService = TestBed.inject(ProductService);
    httpMock = TestBed.get(HttpTestingController);
  });

  describe('GetProductList()', () => {
    it('should http GET product list by GetProductList()', () => {
      const productService = TestBed.inject(ProductService);
      productService.GetProductList().subscribe((res) => {
        expect(res).length > 0;
      });

      const req = httpMock.expectOne('https://deloitteaustralia-dev.outsystemscloud.com/BPService/rest/Products/GetProductList');
      expect(req.request.method).toEqual("GET");

      httpMock.verify();
    });
  });
});
