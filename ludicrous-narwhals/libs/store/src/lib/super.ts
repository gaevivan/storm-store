import { Inject, Injectable, InjectionToken, OnDestroy, Type } from "@angular/core";
import { BehaviorSubject, map, Observable, take, tap } from "rxjs";

export interface StormStoreOptions<T> {
  defaultValue: T;
}
export interface MetaDataModel {
  name: string | null;
  defaults: any;
}
export interface StormStateClassInternal<T = any, U = any> extends StormStateClass<T> {
  META_KEY: MetaDataModel;
  META_OPTIONS_KEY: StormStoreOptions<U>;
}
export function State<T>(options: StormStoreOptions<T>) {

  function getStateOptions(inheritedStateClass: StormStateClassInternal): StormStoreOptions<T> {
    const inheritanceOptions: Partial<StormStoreOptions<T>> =
      inheritedStateClass.META_OPTIONS_KEY || {};
    return { ...inheritanceOptions, ...options };
  }

  return (target: StormStateClass): StormStateClass => {
    if (typeof target !== 'object' || target['META_KEY'] === undefined || target['META_OPTIONS_KEY'] === undefined) {
      return target;
    }
    const stateClass: StormStateClassInternal = target;
    const inheritedStateClass: StormStateClassInternal = Object.getPrototypeOf(stateClass);
    const optionsWithInheritance: StormStoreOptions<T> = getStateOptions(inheritedStateClass);
    stateClass.META_OPTIONS_KEY = optionsWithInheritance;
    return stateClass;
  }
}

@Injectable()
export abstract class StormStateBase<T> {
  abstract defaultValue: T;
}

export interface PlainObject {
  [key: string]: any;
}
type RequireGeneric<T, U> = T extends void ? 'You must provide a type parameter' : U;
export type TokenName<T> = string & RequireGeneric<T, string>;
export type StormStateClass<T = any> = new (...args: any[]) => T;

export class StateToken<T = void> {
  constructor(private readonly name: TokenName<T>) {}

  getName(): string {
    return this.name;
  }

  toString(): string {
    return `StateToken[${this.name}]`;
  }
}

@Injectable()
export class StateStream extends BehaviorSubject<PlainObject> implements OnDestroy {
  constructor() {
    super({});
  }

  ngOnDestroy(): void {
    this.complete();
  }
}

class Controller<T> {
  constructor(private stateClass: Type<StormStateBase<T>>, private stateStream: StateStream) {
  }

  set(value: T): Controller<T> {
    this.stateStream.pipe(take(1), tap((state: PlainObject) => {
      this.stateStream.next({
        ...state,
        [this.stateClass.name]: value
      });
    })).subscribe();
    return this;
  }
}

export const STATE_TOKEN: InjectionToken<Type<StormStateBase<unknown>>> = new InjectionToken('STATE_TOKEN');

@Injectable()
export class Store {
  constructor(
    private stateStream: StateStream,
    @Inject(STATE_TOKEN) private states: StormStateBase<unknown>[]
  ) {
    this.initStream();
  }

  state<T>(stateClass: Type<StormStateBase<T>>): Controller<T> {
    return new Controller<T>(stateClass, this.stateStream);
  }

  select<T>(stateClass: Type<StormStateBase<T>>): Observable<T> {
    return this.stateStream.pipe(
      map((plainObject: PlainObject) => plainObject[stateClass.name])
    )
  }

  private initStream(): void {
    const initValue: PlainObject = {};
    this.states.forEach((state: StormStateBase<unknown>) => {
      initValue[Object.getPrototypeOf(state).constructor.name] = state.defaultValue;
    })
    this.stateStream.next(initValue);
  }
}