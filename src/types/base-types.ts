import * as THREE from "three";

/**
 * Simple event handler by
 * [Jason Kleban](https://gist.github.com/JasonKleban/50cee44960c225ac1993c922563aa540).
 * Keep in mind that:
 * - If you want to remove it later, you might want to declare the callback as
 * an object.
 * - If you want to maintain the reference to `this`, you will need to declare
 * the callback as an arrow function.
 */
export class Event<T> {
  /**
   * Add a callback to this event instance.
   * @param handler - the callback to be added to this event.
   */
  on(handler: T extends void ? { (): void } : { (data: T): void }): void {
    this.handlers.push(handler);
  }

  /**
   * Removes a callback from this event instance.
   * @param handler - the callback to be removed from this event.
   */
  off(handler: T extends void ? { (): void } : { (data: T): void }): void {
    this.handlers = this.handlers.filter((h) => h !== handler);
  }

  /**
   * Triggers all the callbacks assigned to this event.
   */
  trigger: T extends void ? { (): void } : { (data?: T): void } = ((
    data?: T
  ) => {
    // @ts-ignore
    this.handlers.slice(0).forEach((h) => h(data));
  }) as any;

  /**
   * Gets rid of all the suscribed events.
   */
  reset() {
    this.handlers.length = 0;
  }

  private handlers: (T extends void ? { (): void } : { (data: T): void })[] =
    [];
}

/**
 * Whether this component has to be manually destroyed once you are done with
 * it to prevent
 * [memory leaks](https://threejs.org/docs/#manual/en/introduction/How-to-dispose-of-objects).
 * This also ensures that the DOM events created by that component will be
 * cleaned up.
 */
export interface Disposable {
  /**
   * Destroys the object from memory to prevent a
   * [memory leak](https://threejs.org/docs/#manual/en/introduction/How-to-dispose-of-objects).
   */
  dispose: () => void;
}

/**
 * Whether the geometric representation of this component can be
 * hidden or shown in the
 * [Three.js scene](https://threejs.org/docs/#api/en/scenes/Scene).
 */
export interface Hideable {
  /** Whether the geometric representation of this component is
   * currently visible or not in the
   [Three.js scene](https://threejs.org/docs/#api/en/scenes/Scene). */
  visible: boolean;
}

/**
 * Whether this component can be resized. The meaning of this can vary depending
 * on the component: resizing a
 * [Renderer](https://threejs.org/docs/#api/en/renderers/WebGLRenderer)
 * component could mean changing its resolution, whereas resizing a
 * [Mesh](https://threejs.org/docs/#api/en/objects/Mesh) would change its scale.
 */
export interface Resizeable {
  /** Sets size of this component (e.g. the resolution of a
   * [Renderer](https://threejs.org/docs/#api/en/renderers/WebGLRenderer)
   * component. */
  resize: (size?: THREE.Vector2) => void;

  /** Gets the current size of this component (e.g. the resolution of a
   * [Renderer](https://threejs.org/docs/#api/en/renderers/WebGLRenderer)
   * component. */
  getSize: () => THREE.Vector2;
}

/** Whether this component should be updated each frame. */
export interface Updateable {
  /** Actions that should be executed after updating the component. */
  afterUpdate: Event<any>;

  /** Actions that should be executed before updating the component. */
  beforeUpdate: Event<any>;

  /**
   * Function used to update the state of this component each frame. For
   * instance, a renderer component will make a render each frame.
   */
  update(delta?: number): void;
}

/** Whether this component is able to cast rays. */
export interface Raycaster {
  castRay: (items?: THREE.Mesh[]) => THREE.Intersection | null;
}

/** Basic type to describe the progress of any kind of process. */
export interface Progress {
  /** The amount of things that have been done already. */
  current: number;

  /** The total amount of things to be done by the process. */
  total: number;
}

/** Base interface to be implemented by any kind of component
 * aimed to render user interface (DOM elements) in the viewer.
 */
export interface UIComponent extends Disposable, Hideable {
  domElement: HTMLElement
  visible: boolean
  enabled: boolean
}

/**
 * Whether this component supports create and destroy operations. This generally
 * applies for components that work with instances, such as clipping planes or
 * dimensions.
 */
export interface Createable {
  /** Creates a new instance of an element (e.g. a new Dimension). */
  create: (data: any) => void;

  /** Fired after successfully calling {@link Createable.create()}  */
  afterCreate: Event<any>;

  /** Deletes an existing instance of an element (e.g. a Dimension). */
  delete: (data: any) => void;

  /** Fired after successfully calling {@link Createable.delete()}  */
  afterDelete: Event<any>;
}

/** Whether this component has a representation in the user
 * interface, like a button or a window.
 */
export interface UI {
  uiElement: UIComponent;
}
