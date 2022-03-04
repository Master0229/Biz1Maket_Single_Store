import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchItemsComponent } from './dispatch-items.component';

describe('DispatchItemsComponent', () => {
  let component: DispatchItemsComponent;
  let fixture: ComponentFixture<DispatchItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DispatchItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DispatchItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
