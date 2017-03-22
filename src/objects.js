"use strict";

let ChinoAPIObjects = {}

ChinoAPIObjects.names = {
    Application : "application",
    Repository  : "repository",
    Schema      : "schema",
    Document    : "document",
    Collection  : "collection",
    User        : "user",
    UserSchema  : "user_schema",
    Group       : "group",
    Blob        : "blob",
    Permission  : "permissions"
}

/** Js object for wrapping Chino Api objects */
class BaseObject {
  constructor(response, type = "") {
    if (response && response.result_code === 200) {
      Object.assign(this, response.data[type]);
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

ChinoAPIObjects.ChinoList =
    class ChinoList {
      constructor(data, param = "", object = "", result_code = 200) {
        this.count = data.count;
        this.total_count = data.total_count;
        this.list =
            /* use plural name */
            data[param].map((value) =>
                new ChinoAPIObjects[object]({
                  data: {
                    /* use singular name */
                    [ChinoAPIObjects.names[object]]: value
                  },
                  result_code: result_code
                }));
      }
    }

ChinoAPIObjects.checkResult =
    function (response, object = "") {
      if (response.result_code === 200) {
        return new ChinoAPIObjects[object](response);
      }
      else {
        throw new ChinoAPIObjects.ChinoError(response);
      }
    }

ChinoAPIObjects.checkListResult =
    function(response, param = "", object = "") {
      if (response.result_code === 200) {
        return new ChinoAPIObjects.ChinoList(response.data, param, object);
      }
      else {
        throw new ChinoAPIObjects.ChinoError(response);
      }
    }

module.exports = ChinoAPIObjects;