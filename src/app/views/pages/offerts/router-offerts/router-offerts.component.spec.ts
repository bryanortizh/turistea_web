import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterOffertsComponent } from './router-offerts.component';

describe('RouterOffertsComponent', () => {
  let component: RouterOffertsComponent;
  let fixture: ComponentFixture<RouterOffertsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterOffertsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RouterOffertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
