import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductwiseSalesComponent } from './productwise-sales.component';

describe('ProductwiseSalesComponent', () => {
  let component: ProductwiseSalesComponent;
  let fixture: ComponentFixture<ProductwiseSalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductwiseSalesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductwiseSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
