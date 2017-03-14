"use strict";

let ChinoAPIObjects = {}

ChinoAPIObjects.name = {
    REPOSITORIES : "repositories",
    SCHEMAS      : "schemas",
    DOCUMENTS    : "documents",
    COLLECTIONS  : "collections",
    USERS        : "users",
    USER_SCHEMAS : "user_schemas",
    GROUPS       : "groups"
}

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

ChinoAPIObjects.Blob =
    class Blob extends BaseObject {
      constructor(response) {
        super(response, "blob")
      }
    };

ChinoAPIObjects.Perms =
    class Perms extends BaseObject {
      constructor(response) {
        super(response, "permissions")
      }
    };

ChinoAPIObjects.Auth =
    class Auth {
      constructor(response) {
        if (response && response.result_code === 200) {
          for (let key in response.data) {
            this[key] = response.data[key];
          }
        }
      }
    };

ChinoAPIObjects.ChinoError =
    class ChinoError extends Error {
      constructor(response) {
        super(response.message)
        if (response) {
          this.name = "ChinoAPIError";
          this.result_code = response.result_code;
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

ChinoAPIObjects.getList = (data, object, result_code = 200) =>
    data.map((value) =>
        new ChinoAPIObjects[object]({
          data : {
            [object.toLowerCase()] : value
          },
          result_code : result_code
        })
    );

module.exports = ChinoAPIObjects;