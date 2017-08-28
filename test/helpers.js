/*jshint esversion: 6 */
'use strict';

const supertest = require('supertest');
const chai = require('chai');
const app = require('../app');

global.app = app;
global.expect = chai.expect;
global.request = supertest(app);