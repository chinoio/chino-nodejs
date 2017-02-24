/**
 * Created by daniele on 23/02/17.
 */
"use strict";

let ChinoAPIObjects = {}

ChinoAPIObjects.Group =
    class Group {
      constructor(response) {
        if (response && response.result_code === 200) {
          let tmpInfo = response.data.group;

          for (let key in tmpInfo) {
            this[key] = tmpInfo[key];
          }
        }
      }
    };

ChinoAPIObjects.UserSchema =
    class UserSchema {
      constructor(response) {
        if (response && response.result_code === 200) {
          let tmpInfo = response.data.user_schema;

          for (let key in tmpInfo) {
            this[key] = tmpInfo[key];
          }
        }
      }
    };

ChinoAPIObjects.User =
    class User {
      constructor(response = undefined) {
        if (response && response.result_code === 200) {
          let tmpInfo = response.data.user;

          for (let key in tmpInfo) {
            this[key] = tmpInfo[key];
          }
        }
      }
    };

ChinoAPIObjects.Application =
    class Application {
      constructor(response) {
        if (response && response.result_code === 200) {
          let tmpInfo = response.data.application;

          for (let key in tmpInfo) {
            this[key] = tmpInfo[key];
          }
        }
      }
    };


ChinoAPIObjects.Repository =
    class Repository {
      constructor(response) {
        if (response && response.result_code === 200) {
          let tmpInfo = response.data.repository;

          for (let key in tmpInfo) {
            this[key] = tmpInfo[key];
          }
        }
      }
    };

ChinoAPIObjects.Schema =
    class Schema {
      constructor(response) {
        if (response && response.result_code === 200) {
          let tmpInfo = response.data.schema;

          for (let key in tmpInfo) {
            this[key] = tmpInfo[key];
          }
        }
      }
    };

ChinoAPIObjects.Document =
    class Document {
      constructor(response) {
        if (response && response.result_code === 200) {
          let tmpInfo = response.data.document;

          for (let key in tmpInfo) {
            this[key] = tmpInfo[key];
          }
        }
      }
    };

ChinoAPIObjects.Collection =
    class Collection {
      constructor(response) {
        if (response && response.result_code === 200) {
          let tmpInfo = response.data.collection;

          for (let key in tmpInfo) {
            this[key] = tmpInfo[key];
          }
        }
      }
    };

module.exports = ChinoAPIObjects;