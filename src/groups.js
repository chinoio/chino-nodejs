"use strict";

const objects = require("./objects");
const ChinoAPIBase = require("./chinoBase");

class ChinoAPIGroups extends ChinoAPIBase {
  /** Create a caller for Groups Chino APIs
   *
   * @param baseUrl     {string}  The url endpoint for APIs
   * @param customerId  {string}  The Chino customer id or bearer token
   * @param customerKey {string | null}  The Chino customer key or null (not provided)
   */
  constructor(baseUrl, customerId, customerKey = null) {
    super(baseUrl, customerId, customerKey);
  }

  /** Return the list of existing groups
   *
   * @param offset  {int}
   * @param limit   {int}
   * @return {Promise.<Array, objects.ChinoError>}
   *         A promise that return a list of Group object if resolved,
   *         otherwise throw an ChinoError object if rejected
   *         or was not retrieved a success status
   *
   */
  list(offset = 0, limit = 10) {
    const params = {
      offset : offset,
      limit : limit
    };

    return this.call.get(`/groups`, params)
        .then((result) => {
          if (result.result_code === 200) {
            return objects.getList(result.data.groups, "Group");
          }
          else {
            throw new objects.ChinoError(result);
          }
        })
        .catch((error) => { throw new objects.ChinoError(error); });
  }

  /** Create a new group
   *
   * @param data          {object}
   * @return {Promise.<objects.Group, objects.ChinoError>}
   *         A promise that return a Group object if resolved,
   *         otherwise throw an ChinoError object if rejected
   *         or was not retrieved a success status
   */
  create(data) {
    return this.call.post(`/groups`, data)
        .then((result) => {
          if (result.result_code === 200) {
            return new objects.Group(result);
          }
          else {
            throw new objects.ChinoError(result);
          }
        })
        .catch((error) => { throw new objects.ChinoError(error); });
  }

  /** Return information about group selected by its id
   *
   * @param groupId  {string}
   * @return {Promise.<objects.Group, objects.ChinoError>}
   *         A promise that return a Group object if resolved,
   *         otherwise throw an ChinoError object if rejected
   *         or was not retrieved a success status
   */
  details(groupId) {
    return this.call.get(`/groups/${groupId}`)
        .then((result) => {
          if (result.result_code === 200) {
            return new objects.Group(result);
          }
          else {
            throw new objects.ChinoError(result);
          }
        })
        .catch((error) => { throw new objects.ChinoError(error); });
  }

  /** Update information about group selected by its id
   *  with data as group information
   *
   * @param groupId  {string}
   * @param data     {object}
   * @return {Promise.<objects.Group, objects.ChinoError>}
   *         A promise that return a Group object if resolved,
   *         otherwise throw an ChinoError object if rejected
   *         or was not retrieved a success status
   */
  update(groupId, data) {
    return this.call.put(`/groups/${groupId}`, data)
        .then((result) => {
          if (result.result_code === 200) {
            return new objects.Group(result);
          }
          else {
            throw new objects.ChinoError(result);
          }
        })
        .catch((error) => { throw new objects.ChinoError(error); });
  }

  /** Deactivate (or delete) group selected by its id
   *
   * @param groupId {string}
   * @param force   {boolean} If true delete group information
   *                          otherwise only deactivate it.
   *                          Default value is false (deactivate)
   * @return {Promise.<objects.Success, objects.ChinoError>}
   *         A promise that return a Success object if resolved,
   *         otherwise throw an ChinoError object if rejected
   *         or was not retrieved a success status
   */
  delete(groupId, force = false) {
    const params = { force : force };

    return this.call.del(`/groups/${groupId}`, params)
        .then((result) => {
          if (result.result_code === 200) {
            return new objects.Success(result);
          }
          else {
            throw new objects.ChinoError(result);
          }
        })
        .catch((error) => { throw new objects.ChinoError(error); });
  }

  /** Insert the selected user into the selected group
   *
   * @param groupId {string} The id of the selected group
   * @param userId  {string} The id of the selected user
   * @returns {Promise.<objects.Success, objects.ChinoError>}
   *         A promise that return a Success object if resolved,
   *         otherwise throw an ChinoError object if rejected
   *         or was not retrieved a success status
   */
  insertUser(groupId, userId) {
    return this.call.post(`/groups/${groupId}/users/${userId}`, {})
        .then((result) => {
          if (result.result_code === 200) {
            return new objects.Success(result);
          }
          else {
            throw new objects.ChinoError(result);
          }
        })
        .catch((error) => { throw new objects.ChinoError(error); });
  }

  /** Remove the selected user from the selected
   *
   * @param groupId {string} The id of the selected group
   * @param userId  {string} The id of the selected user
   * @returns {Promise.<objects.Success, objects.ChinoError>}
   *         A promise that return a Success object if resolved,
   *         otherwise throw an ChinoError object if rejected
   *         or was not retrieved a success status
   */
  removeUser(groupId, userId) {
    return this.call.del(`/groups/${groupId}/users/${userId}`)
        .then((result) => {
          if (result.result_code === 200) {
            return new objects.Success(result);
          }
          else {
            throw new objects.ChinoError(result);
          }
        })
        .catch((error) => { throw new objects.ChinoError(error); });
  }
}

module.exports = ChinoAPIGroups;