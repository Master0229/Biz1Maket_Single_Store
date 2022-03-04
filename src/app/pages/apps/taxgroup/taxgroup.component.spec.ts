import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxgroupComponent } from './taxgroup.component';

describe('TaxgroupComponent', () => {
  let component: TaxgroupComponent;
  let fixture: ComponentFixture<TaxgroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaxgroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxgroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
