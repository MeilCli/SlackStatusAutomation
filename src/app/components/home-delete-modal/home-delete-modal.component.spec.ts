import { ComponentFixture, TestBed } from "@angular/core/testing";

import { HomeDeleteModalComponent } from "./home-delete-modal.component";

describe("HomeDeleteModalComponent", () => {
    let component: HomeDeleteModalComponent;
    let fixture: ComponentFixture<HomeDeleteModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [HomeDeleteModalComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(HomeDeleteModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
