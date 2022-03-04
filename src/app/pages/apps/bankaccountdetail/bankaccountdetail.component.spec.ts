import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankaccountdetailComponent } from './bankaccountdetail.component';

describe('BankaccountdetailComponent', () => {
  let component: BankaccountdetailComponent;
  let fixture: ComponentFixture<BankaccountdetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankaccountdetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BankaccountdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
