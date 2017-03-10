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
   * @return {Promise.<objects.User, objects.ChinoError>}
   *         A promise that return a User object if resolved,
   *         otherwise throw a ChinoError object if rejected
   *         or was not retrieved a success status
   */
  current() {
     return this.call.get("/users/me")
         .then((result) => {
           if (result.result_code === 200) {
             return new objects.User(result);
           }
           else {
             throw new objects.ChinoError(result);
           }
         })
         .catch((error) => { throw new objects.ChinoError(error); });
  }

  /** Return a list of current users inside the selected
   *  user schema by its id
   *
   * @param userSchemaId  {string}
   * @param offset        {int}
   * @param limit         {int}
   * @return {Promise.<Array, objects.ChinoError>}
   *         A promise that return a list of User object if resolved,
   *         otherwise throw a ChinoError object if rejected
   *         or was not retrieved a success status
   *
   */
  list(userSchemaId, offset = 0, limit = 10) {
    const params = {
      offset : offset,
      limit : limit
    };

    return this.call.get(`/user_schemas/${userSchemaId}/users`, params)
        .then((result) => {
          if (result.result_code === 200) {
            return objects.getList(result.data.users, "User");
          }
          else {
            throw new objects.ChinoError(result);
          }
        })

        .catch((error) => { throw new objects.ChinoError(error); });
  }

  /** Create a new user inside selected user schema by its id
   *  with data as user information
   *
   * @param userSchemaId  {string}
   * @param data          {object}
   * @return {Promise.<objects.User, objects.ChinoError>}
   *         A promise that return a User object if resolved,
   *         otherwise throw a ChinoError object if rejected
   *         or was not retrieved a success status
   */
  create(userSchemaId, data) {
    return this.call.post(`/user_schemas/${userSchemaId}/users`, data)
        .then((result) => {
          if (result.result_code === 200) {
            return new objects.User(result);
          }
          else {
            throw new objects.ChinoError(result);
          }
        })
        .catch((error) => { throw new objects.ChinoError(error); });
  }

  /** Return information about selected user by its id
   *
   * @param userId  {string}
   * @return {Promise.<objects.User, objects.ChinoError>}
   *         A promise that return a User object if resolved,
   *         otherwise throw a ChinoError object if rejected
   *         or was not retrieved a success status
   */
  details(userId) {
    return this.call.get(`/users/${userId}`)
        .then((result) => {
          if (result.result_code === 200) {
            return new objects.User(result);
          }
          else {
            throw new objects.ChinoError(result);
          }
        })
        .catch((error) => { throw new objects.ChinoError(error); });
  }

  /** Update information about selected user by its id
   *  with data as new user information
   *
   * @param userId  {string}
   * @param data    {object}
   * @return {Promise.<objects.User, objects.ChinoError>}
   *         A promise that return a User object if resolved,
   *         otherwise throw a ChinoError object if rejected
   *         or was not retrieved a success status
   */
  update(userId, data) {
    return this.call.put(`/users/${userId}`, data)
        .then((result) => {
          if (result.result_code === 200) {
            return new objects.User(result);
          }
          else {
            throw new objects.ChinoError(result);
          }
        })
        .catch((error) => { throw new objects.ChinoError(error); });
  }

  /** Update a specific part of information about
   *  selected user by its id with data as information
   *
   * @param userId  {string}
   * @param data    {object}
   * @return {Promise.<objects.User, objects.ChinoError>}
   *         A promise that return a User object if resolved,
   *         otherwise throw a ChinoError object if rejected
   *         or was not retrieved a success status
   */
  partialUpdate(userId, data) {
    return this.call.patch(`/users/${userId}`, data)
        .then((result) => {
          if (result.result_code === 200) {
            return new objects.User(result);
          }
          else {
            throw new objects.ChinoError(result);
          }
        })
        .catch((error) => { throw new objects.ChinoError(error); });
  }

  /** Deactivate (or delete) selected user by its id
   *
   * @param userId  {string}
   * @param force   {boolean} If true delete user information
   *                          otherwise only deactivate it.
   *                          Default value is false (deactivate)
   * @return {Promise.<objects.Success, objects.ChinoError>}
   *         A promise that return a Success object if resolved,
   *         otherwise throw a ChinoError object if rejected
   *         or was not retrieved a success status
   */
  delete(userId, force = false) {
    const params = { force : force };

    return this.call.del(`/users/${userId}`, params)
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

module.exports = ChinoAPIUsers;