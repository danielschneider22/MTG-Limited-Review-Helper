import { Injectable } from '@angular/core';
import * as Magic from "mtgsdk-ts";

@Injectable()
export class CardReviewGameService {
  public selectedSetForGame : Magic.Set = null;
  public playingGame : boolean;
  constructor() { }

}
