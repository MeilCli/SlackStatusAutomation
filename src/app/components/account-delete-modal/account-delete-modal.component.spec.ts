import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AccountDeleteModalComponent } from "./account-delete-modal.component";

describe("AccountDeleteModalComponent", () => {
    let component: AccountDeleteModalComponent;
    let fixture: ComponentFixture<AccountDeleteModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AccountDeleteModalComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AccountDeleteModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
