import { ModuleWithProviders, NgModule, Type } from "@angular/core";
import { StateStream, STATE_TOKEN, Store, StormStateBase } from "./super";

@NgModule()
export class StormStoreModule {
  static forRoot(
    states: Type<StormStateBase<unknown>>[]
  ): ModuleWithProviders<StormStoreModule> {
    return {
      ngModule: StormStoreModule,
      providers: [ Store, StateStream, 
        states.map((stateClass: Type<StormStateBase<unknown>>) => {
          return {
            provide: STATE_TOKEN,
            useClass: stateClass,
            multi: true
          }
        })
      ],
    }
  }
}