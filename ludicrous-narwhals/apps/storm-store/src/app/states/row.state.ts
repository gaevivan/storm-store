import { Injectable } from "@angular/core";
import { StormStateBase } from '@ludicrous-narwhals/store';

interface Row {
  index: number;
}

@Injectable()
export class RowState extends StormStateBase<Row> {
  defaultValue: Row = {
    index: 12
  }
}