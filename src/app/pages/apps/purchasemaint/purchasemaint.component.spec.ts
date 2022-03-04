import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasemaintComponent } from './purchasemaint.component';

describe('PurchasemaintComponent', () => {
  let component: PurchasemaintComponent;
  let fixture: ComponentFixture<PurchasemaintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchasemaintComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchasemaintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
