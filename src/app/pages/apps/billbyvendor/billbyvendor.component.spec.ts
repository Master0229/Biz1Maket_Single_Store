import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillbyvendorComponent } from './billbyvendor.component';

describe('BillbyvendorComponent', () => {
  let component: BillbyvendorComponent;
  let fixture: ComponentFixture<BillbyvendorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillbyvendorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillbyvendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
