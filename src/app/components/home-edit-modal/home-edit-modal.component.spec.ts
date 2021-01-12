import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeEditModalComponent } from './home-edit-modal.component';

describe('HomeEditModalComponent', () => {
  let component: HomeEditModalComponent;
  let fixture: ComponentFixture<HomeEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeEditModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
