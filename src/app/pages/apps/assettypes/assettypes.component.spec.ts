import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssettypesComponent } from './assettypes.component';

describe('AssettypesComponent', () => {
  let component: AssettypesComponent;
  let fixture: ComponentFixture<AssettypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssettypesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssettypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
