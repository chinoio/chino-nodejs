"use strict";

let ChinoAPIObjects = {}

ChinoAPIObjects.names = {
    APPLICATIONS : ["application" , "applications"],
    REPOSITORIES : ["repository"  , "repositories"],
    SCHEMAS      : ["schema"      , "schemas"],
    DOCUMENTS    : ["document"    , "documents"],
    COLLECTIONS  : ["collection"  , "collections"],
    USERS        : ["user"        , "users"],
    USER_SCHEMAS : ["user_schema" , "user_schemas"],
    GROUPS       : ["group"       , "groups"],
    BLOBS        : ["blob"        , "blobs"],
    PERMISSIONS  : ["permission"  , "permissions"]
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
        super(response, ChinoAPIObjects.names.GROUPS[0])
      }
    };

ChinoAPIObjects.UserSchema =
    class UserSchema extends BaseObject {
      constructor(response) {
        super(response, ChinoAPIObjects.names.USER_SCHEMAS[0])
      }
    };

ChinoAPIObjects.User =
    class User extends BaseObject {
      constructor(response) {
        super(response, ChinoAPIObjects.names.USERS[0])
      }
    };

ChinoAPIObjects.Application =
    class Application extends BaseObject {
      constructor(response) {
        super(response, ChinoAPIObjects.names.APPLICATIONS[0])
      }
    };


ChinoAPIObjects.Repository =
    class Repository extends BaseObject {
      constructor(response) {
        super(response, ChinoAPIObjects.names.REPOSITORIES[0])
      }
    };

ChinoAPIObjects.Schema =
    class Schema extends BaseObject {
      constructor(response) {
        super(response, ChinoAPIObjects.names.SCHEMAS[0])
      }
    };

ChinoAPIObjects.Document =
    class Document extends BaseObject {
      constructor(response) {
        super(response, ChinoAPIObjects.names.DOCUMENTS[0])
      }
    };

ChinoAPIObjects.Collection =
    class Collection extends BaseObject {
      constructor(response) {
        super(response, ChinoAPIObjects.names.COLLECTIONS[0])
      }
    };

ChinoAPIObjects.Blob =
    class Blob extends BaseObject {
      constructor(response) {
        super(response, ChinoAPIObjects.names.BLOBS[0])
      }
    };

ChinoAPIObjects.Perms =
    class Perms extends BaseObject {
      constructor(response) {
        super(response, ChinoAPIObjects.names.PERMISSIONS[1])
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
      constructor(data, param, object, result_code = 200) {
        this.count = data.count;
        this.total_count = data.total_count;
        this.list =
            /* use plural name */
            data[param].map((value) =>
              new ChinoAPIObjects[object]({
                data: {
                  /* use singular name */
                  [ChinoAPIObjects.names[param.toUpperCase()][0]]: value
                },
                result_code: result_code
              }));
      }
    }

module.exports = ChinoAPIObjects;