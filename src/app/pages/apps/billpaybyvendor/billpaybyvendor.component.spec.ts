import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillpaybyvendorComponent } from './billpaybyvendor.component';

describe('BillpaybyvendorComponent', () => {
  let component: BillpaybyvendorComponent;
  let fixture: ComponentFixture<BillpaybyvendorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillpaybyvendorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillpaybyvendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
