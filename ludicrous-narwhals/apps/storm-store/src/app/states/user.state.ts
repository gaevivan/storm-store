import { Injectable } from "@angular/core";
import { StormStateBase } from '@ludicrous-narwhals/store';

interface User {
  name: string;
  secondName: string;
}

@Injectable()
export class UserState extends StormStateBase<User> {
  defaultValue: User = {
    name: '1',
    secondName: '2'
  }
}