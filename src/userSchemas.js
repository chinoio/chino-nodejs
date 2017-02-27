/**
 * Created by daniele on 23/02/17.
 */
"use strict";

const objects = require("./objects");
const ChinoAPIBase = require("./chinoBase");

class ChinoAPIUserSchemas {
  /** Create a caller for User Schemas Chino APIs
   *
   * @param baseUrl     {string}  The url endpoint for APIs
   * @param customerId  {string}  The Chino customer id or bearer token
   * @param customerKey {string}  The Chino customer key or null (not provided)
   */
  constructor(baseUrl, customerId, customerKey = null) {
    super(baseUrl, customerId, customerKey);
  }

  /* list */
  list() {
    return this.call.get("/user_schemas")
        .then((result) => new objects.User(result))
        .catch((error) => {
          /* TODO: log the error */
          return new objects.User();
        });
  }
  /* create */
  /* details */
  /* update */
  /* delete */
}

/*
 /user_schemas
 /user_schemas
 /user_schemas/{user_schema_id}
 /user_schemas/{user_schema_id}
 /user_schemas/{user_schema_id}{?force}
 */

module.exports = ChinoAPIUserSchemas;