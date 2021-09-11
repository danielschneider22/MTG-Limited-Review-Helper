import { TestBed, inject } from '@angular/core/testing';

import { GetMtgCardsService } from './get-mtg-cards.service';

describe('GetMtgCardsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GetMtgCardsService]
    });
  });

  it('should ...', inject([GetMtgCardsService], (service: GetMtgCardsService) => {
    expect(service).toBeTruthy();
  }));
});
