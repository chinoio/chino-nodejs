/**
 * Created by daniele on 22/02/17.
 */
"use strict";

const objects = require("./objects");
const ChinoAPIBase = require("./chinoBase");

class ChinoAPIGroups extends ChinoAPIBase {
  /** Create a caller for Groups Chino APIs
   *
   * @param baseUrl     {string}  The url endpoint for APIs
   * @param customerId  {string}  The Chino customer id or bearer token
   * @param customerKey {string}  The Chino customer key or null (not provided)
   */
  constructor(baseUrl, customerId, customerKey = null) {
    super(baseUrl, customerId, customerKey);
  }
}

/*
/groups
/groups
/groups/{group_id}
/groups/{group_id}
/groups/{group_id}{?force}
/groups/{group_id}/users/{user_id}
/groups/{group_id}/users/{user_id}
*/

module.exports = ChinoAPIGroups;