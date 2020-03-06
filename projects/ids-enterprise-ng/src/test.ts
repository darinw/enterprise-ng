// This file is required by karma.conf.js and loads recursively all the .spec and framework files

/// <reference path="./lib/soho.d.ts" />

import 'core-js/es/reflect';
import 'zone.js/dist/zone';
import 'zone.js/dist/zone-testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

declare const require: any;

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);
// Then we find all the tests.
const context = require.context('./', true, /\.spec\.ts$/);
// And load the modules.
context.keys().map(context);

// HACK: Chrome XX disconnects if there are too many synchronous tests in a row
// because it appears to lock up the thread that communicates to Karma's socket
// This async beforeEach gets called on every spec and releases the JS thread long
// enough for the socket to continue to communicate.
// The downside is that it creates a minor performance penalty of around 10-15%
// increase in the time it takes to run out unit tests.
beforeEach((done) => done());
