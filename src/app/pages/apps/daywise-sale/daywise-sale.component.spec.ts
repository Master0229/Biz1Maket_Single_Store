import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaywiseSaleComponent } from './daywise-sale.component';

describe('DaywiseSaleComponent', () => {
  let component: DaywiseSaleComponent;
  let fixture: ComponentFixture<DaywiseSaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DaywiseSaleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DaywiseSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
