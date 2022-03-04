import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditrepayComponent } from './creditrepay.component';

describe('CreditrepayComponent', () => {
  let component: CreditrepayComponent;
  let fixture: ComponentFixture<CreditrepayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditrepayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditrepayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
