/// <reference path="../autocomplete/soho-autocomplete.d.ts" />

/**
 * Soho Searchfield Control Typings.
 *
 * This file contains the Typescript mappings for the public
 * interface of the Soho jQuery searchfield control.
 */

/**
 * Configuration options.
 */
interface SohoSearchFieldOptions extends SohoAutoCompleteOptions {
  /** All results callback - @todo prototype! */
  allResultsCallback?: (searchTerm: string) => void;

  /** Shows all results? */
  showAllResults?: boolean;

  /** Displays a dropdown containing categories that can be used to filter results. */
  categories?: Object[];

  /** If true, creates a multiselectable Categories list. */
  categoryMultiselect?: boolean;

  /** If true, will show any available categories that are selected to the left of the Dropdown field. */
  showCategoryText?: boolean;

  /* *Has an X to clear? */
  clearable?: boolean;

  /* Is able to be collapsed */
  collapsible?: boolean;

  /* Can either be a number, or a function resolving a number */
  collapseSize?: ((api: SohoSearchFieldStatic) => number)|number;
}

/**
 * Soho control seachfield api.
 */
interface SohoSearchFieldStatic {
  /** Category Button */
  categoryButton?: JQuery;

  /** Internal element reference */
  element: JQuery;

  /** If this component resides within a toolbar, this returns `true` */
  toolbarParent?: boolean|undefined;

  /** Destructor. */
  destroy(): void;

  /** Clear */
  clear(): void;

  /** Updated */
  updated(settings?: SohoSearchFieldOptions): void;
}

/**
 * Type safe SearchField event object.
 */
interface SohoSearchFieldEvent extends JQuery.TriggeredEvent {
  data: any;
}

/**
 * JQuery Integration
 */
interface JQueryStatic {
  searchfield: SohoSearchFieldStatic;
}

interface JQuery<TElement = HTMLElement> extends Iterable<TElement> {
  searchfield(options?: SohoSearchFieldOptions): JQuery;
}
