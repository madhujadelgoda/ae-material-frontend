import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkAllocate } from './bulk-allocate';

describe('BulkAllocate', () => {
  let component: BulkAllocate;
  let fixture: ComponentFixture<BulkAllocate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BulkAllocate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BulkAllocate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
