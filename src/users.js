"use strict";

const objects = require("./objects");
const ChinoAPIBase = require("./chinoBase");

class ChinoAPIUsers extends ChinoAPIBase {
  /** Create a caller for Users Chino APIs
   *
   * @param baseUrl     {string}  The url endpoint for APIs
   * @param customerId  {string}  The Chino customer id or bearer token
   * @param customerKey {string | null}  The Chino customer key or null (not provided)
   */
  constructor(baseUrl, customerId, customerKey = null) {
    super(baseUrl, customerId, customerKey);
  }

  /** Return information about current user
   *  NOTE: need to be authenticated with bearer token
   *
   * @return {Promise.<objects.User, objects.ChinoException>}
   *         A promise that return a User object if resolved,
   *         otherwise throw a ChinoException object if rejected
   *         or was not retrieved a success status
   */
  current() {
    return this.call.get("/users/me")
        .then((result) => objects.checkResult(result, "User"))
        .catch((error) => { throw new objects.ChinoException(error); });
  }

  /** Return a list of current users inside the selected
   *  user schema by its id
   *
   * @param userSchemaId  {string}
   * @param offset        {int}
   * @param limit         {int}
   * @return {Promise.<Array, objects.ChinoException>}
   *         A promise that return a list of User object if resolved,
   *         otherwise throw a ChinoException object if rejected
   *         or was not retrieved a success status
   *
   */
  list(userSchemaId, offset = 0, limit = 10) {
    const params = {
      offset : offset,
      limit : limit
    };

    return this.call.get(`/user_schemas/${userSchemaId}/users`, params)
        .then((result) => objects.checkListResult(result, "users", "User"))
        .catch((error) => { throw new objects.ChinoException(error); });
  }

  /** Create a new user inside selected user schema by its id
   *  with data as user information
   *
   * @param userSchemaId  {string}
   * @param data          {object}
   * @return {Promise.<objects.User, objects.ChinoException>}
   *         A promise that return a User object if resolved,
   *         otherwise throw a ChinoException object if rejected
   *         or was not retrieved a success status
   */
  create(userSchemaId, data) {
    return this.call.post(`/user_schemas/${userSchemaId}/users`, data)
        .then((result) => objects.checkResult(result, "User"))
        .catch((error) => { throw new objects.ChinoException(error); });
  }

  /** Return information about selected user by its id
   *
   * @param userId  {string}
   * @return {Promise.<objects.User, objects.ChinoException>}
   *         A promise that return a User object if resolved,
   *         otherwise throw a ChinoException object if rejected
   *         or was not retrieved a success status
   */
  details(userId) {
    return this.call.get(`/users/${userId}`)
        .then((result) => objects.checkResult(result, "User"))
        .catch((error) => { throw new objects.ChinoException(error); });
  }

  /** Update information about selected user by its id
   *  with data as new user information
   *
   * @param userId  {string}
   * @param data    {object}
   * @return {Promise.<objects.User, objects.ChinoException>}
   *         A promise that return a User object if resolved,
   *         otherwise throw a ChinoException object if rejected
   *         or was not retrieved a success status
   */
  update(userId, data) {
    return this.call.put(`/users/${userId}`, data)
        .then((result) => objects.checkResult(result, "User"))
        .catch((error) => { throw new objects.ChinoException(error); });
  }

  /** Update a specific part of information about
   *  selected user by its id with data as information
   *
   * @param userId  {string}
   * @param data    {object}
   * @return {Promise.<objects.User, objects.ChinoException>}
   *         A promise that return a User object if resolved,
   *         otherwise throw a ChinoException object if rejected
   *         or was not retrieved a success status
   */
  partialUpdate(userId, data) {
    return this.call.patch(`/users/${userId}`, data)
        .then((result) => objects.checkResult(result, "User"))
        .catch((error) => { throw new objects.ChinoException(error); });
  }

  /** Deactivate (or delete) selected user by its id
   *
   * @param userId  {string}
   * @param force   {boolean} If true delete user information
   *                          otherwise only deactivate it.
   *                          Default value is false (deactivate)
   * @return {Promise.<objects.Success, objects.ChinoException>}
   *         A promise that return a Success object if resolved,
   *         otherwise throw a ChinoException object if rejected
   *         or was not retrieved a success status
   */
  delete(userId, force = false) {
    const params = { force : force };

    return this.call.del(`/users/${userId}`, params)
        .then((result) => objects.checkResult(result, "Success"))
        .catch((error) => { throw new objects.ChinoException(error); });
  }
}

module.exports = ChinoAPIUsers;