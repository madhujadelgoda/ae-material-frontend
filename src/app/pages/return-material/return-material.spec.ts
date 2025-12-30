import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnMaterial } from './return-material';

describe('ReturnMaterial', () => {
  let component: ReturnMaterial;
  let fixture: ComponentFixture<ReturnMaterial>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReturnMaterial]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReturnMaterial);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
