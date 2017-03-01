/**
 * Created by daniele on 23/02/17.
 */
"use strict";

let ChinoAPIObjects = {}

/** Js object for wrapping Chino Api objects */
class BaseObject {
  constructor(response, type = "") {
    if (response && response.result_code === 200) {
      let tmpInfo = response.data[type];

      for (let key in tmpInfo) {
        this[key] = tmpInfo[key];
      }
    }
  }
}

ChinoAPIObjects.Group =
    class Group extends BaseObject {
      constructor(response) {
        super(response, "group")
      }
    };

ChinoAPIObjects.UserSchema =
    class UserSchema extends BaseObject {
      constructor(response) {
        super(response, "user_schema")
      }
    };

ChinoAPIObjects.User =
    class User extends BaseObject {
      constructor(response) {
        super(response, "user")
      }
    };

ChinoAPIObjects.Application =
    class Application extends BaseObject {
      constructor(response) {
        super(response, "application")
      }
    };


ChinoAPIObjects.Repository =
    class Repository extends BaseObject {
      constructor(response) {
        super(response, "repository")
      }
    };

ChinoAPIObjects.Schema =
    class Schema extends BaseObject {
      constructor(response) {
        super(response, "schema")
      }
    };

ChinoAPIObjects.Document =
    class Document extends BaseObject {
      constructor(response) {
        super(response, "document")
      }
    };

ChinoAPIObjects.Collection =
    class Collection extends BaseObject {
      constructor(response) {
        super(response, "collection")
      }
    };

ChinoAPIObjects.BlobUncommitted =
    class BlobUncommitted extends BaseObject {
      constructor(response) {
        super(response, "blob")
      }
    };

// TODO: review this class
// this must be used to store blob information
// only when it is confirmed on the server
ChinoAPIObjects.Blob =
    class Blob extends BlobUncommitted {};

ChinoAPIObjects.Perms =
    class Perms extends BaseObject {
      constructor(response) {
        super(response, "permissions")
      }
    };

ChinoAPIObjects.Error =
    class Error {
      constructor(response) {
        if (response) {
          for (let key in response) {
            this[key] = response[key];
          }
        }
      }
    }

ChinoAPIObjects.Success =
    class Success {
      constructor(response) {
        if (response) {
          for (let key in response) {
            this[key] = response[key];
          }
        }
      }
    }

module.exports = ChinoAPIObjects;