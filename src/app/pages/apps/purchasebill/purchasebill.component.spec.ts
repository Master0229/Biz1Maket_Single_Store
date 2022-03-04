import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasebillComponent } from './purchasebill.component';

describe('PurchasebillComponent', () => {
  let component: PurchasebillComponent;
  let fixture: ComponentFixture<PurchasebillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchasebillComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchasebillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
