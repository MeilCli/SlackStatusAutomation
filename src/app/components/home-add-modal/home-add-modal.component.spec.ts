import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeAddModalComponent } from './home-add-modal.component';

describe('HomeAddModalComponent', () => {
  let component: HomeAddModalComponent;
  let fixture: ComponentFixture<HomeAddModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeAddModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeAddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
