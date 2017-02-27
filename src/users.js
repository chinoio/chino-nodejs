/**
 * Created by daniele on 22/02/17.
 */
"use strict";

const objects = require("./objects");
const ChinoAPIBase = require("./chinoBase");

class ChinoAPIUsers extends ChinoAPIBase {
  /** Create a caller for Users Chino APIs
   *
   * @param baseUrl     {string}  The url endpoint for APIs
   * @param customerId  {string}  The Chino customer id or bearer token
   * @param customerKey {string}  The Chino customer key or null (not provided)
   */
  constructor(baseUrl, customerId, customerKey = null) {
    super(baseUrl, customerId, customerKey);
  }

  /** Return information about current user
   *  NOTE: need to be authenticated with bearer
   */
  current() {
     return this.call.get("/users/me")
         .then((result) => new objects.User(result))
         .catch((error) => {
            /* TODO: log the error */
            return new objects.User();
         });
  }

  /** Return a list of current users inside the selected
   *  user schema by its id
   *
   * @param userSchemaId  {string}
   */
  list(userSchemaId) {
    let users = [];

    return this.call.get(`/user_schemas/${userSchemaId}/users`)
        .then((result) => {
          if (result.result_code === 200) {
            result.data.users.forEach((userInfo) => {
              let userData = {
                data : {
                  user: userInfo
                },
                result_code : result.result_code
              };

              users.push(new objects.User(userData));
            })

            return users;
          }
          else {
            throw new objects.Error(result);
          }
        })

        .catch((error) => { throw new objects.Error(error); });
  }

  /** Create a new user inside selected user schema by its id
   *  with data as user information
   *
   * @param userSchemaId  {string}
   * @param data          {object}
   */
  create(userSchemaId, data) {
    return this.call.post(`/user_schemas/${userSchemaId}/users`, data)
        .then((result) => {
          if (result.result_code === 200) {
            return new objects.User(result);
          }
          else {
            throw new objects.Error(result);
          }
        })
        .catch((error) => { throw new objects.Error(error); });
  }

  /** Return information about selected user by its id
   *
   * @param userId  {string}
   */
  details(userId) {
    return this.call.get(`/users/${userId}`)
        .then((result) => {
          if (result.result_code === 200) {
            return new objects.User(result);
          }
          else {
            throw new objects.Error(result);
          }
        })
        .catch((error) => { throw new objects.Error(error); });
  }

  /** Update information about selected user by its id
   *  with data as new user information
   *
   * @param userId  {string}
   * @param data    {object}
   */
  update(userId, data) {
    return this.call.put(`/users/${userId}`, data)
        .then((result) => {
          if (result.result_code === 200) {
            return new objects.User(result);
          }
          else {
            throw new objects.Error(result);
          }
        })
        .catch((error) => { throw new objects.Error(error); });
  }

  /** Update a specific part of information about
   *  selected user by its id with data as information
   *
   * @param userId  {string}
   * @param data    {object}
   */
  patch(userId, data) {
    return this.call.patch(`/users/${userId}`, data)
        .then((result) => {
          if (result.result_code === 200) {
            return new objects.User(result);
          }
          else {
            throw new objects.Error(result);
          }
        })
        .catch((error) => { throw new objects.Error(error); });
  }

  /** Deactivate (or delete) selected user by its id
   *
   * @param userId  {string}
   * @param force   {bool}   If true delete user information
   *                         otherwise only deactivate it.
   *                         Default value is false (deactivate)
   */
  delete(userId, force = false) {
    const url = force
        ? `/users/${userId}?force=true`
        : `/users/${userId}`;

    return this.call.del(url)
        .then((result) => {
          if (result.result_code === 200) {
            return new objects.Success(result);
          }
          else {
            throw new objects.Error(result);
          }
        })
        .catch((error) => { throw new objects.Error(error); });
  }
}

module.exports = ChinoAPIUsers;