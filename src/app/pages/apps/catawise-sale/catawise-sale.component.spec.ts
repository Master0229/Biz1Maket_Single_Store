import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatawiseSaleComponent } from './catawise-sale.component';

describe('CatawiseSaleComponent', () => {
  let component: CatawiseSaleComponent;
  let fixture: ComponentFixture<CatawiseSaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatawiseSaleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CatawiseSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
