import { Component } from '@angular/core';
import { Store } from '@ludicrous-narwhals/store';
import { UserState } from './states/user.state';

@Component({
  selector: 'ludicrous-narwhals-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'storm-store';

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.select(UserState).subscribe(console.log);
    this.store.state(UserState).set({
      secondName: '2',
      name: '1'
    });
  }
}
