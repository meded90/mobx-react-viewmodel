/// ------------------------------------------
// Typings
//

export type IViewModel<
  P extends ViewModelProps | undefined = undefined
> = P extends {} ? ViewModelWithProps<P> : BaseViewModel;

// Base view-model interface
interface BaseViewModel {
  dispose?: () => void;
  init?: () => void;
}

// View-model interface with reactive Props from React component
export type ViewModelProps = {};
export type ViewModelArgs = Array<unknown>
export interface ViewModelWithProps<P extends ViewModelProps>
  extends BaseViewModel {
  // You should use @observable.ref for props in your view-model classes
  props: P;
}

// Constructor class for view models
export type IViewModelClass<
  T extends IViewModel<P>,
  P extends ViewModelProps | undefined = undefined,
  Args extends ViewModelArgs = ViewModelArgs
> = P extends {} //
  ? Args extends []
    ? { new (props: P, ...args: Args): T }
    : { new (props: P, ...args: Args): T } // HACK: this place should be { new (props: P): T }
  : { new (): T }
