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
          for (let userInfo in result.data.users)
            users.push(new objects.User({ data : { user : userInfo } }));

          return users;
        })
        .catch((error) => {
          /* TODO: log the error */
          return users;
        });
  }

  /** Create a new user inside selected user schema by its id
   *  with data as user information
   *
   * @param userSchemaId  {string}
   * @param data          {object}
   */
  create(userSchemaId, data) {
    return this.call.post(`/user_schemas/${userSchemaId}/users`, data)
        .then((result) => new objects.User(result))
        .catch((error) => {
          /* TODO: log the error or THROW*/
          return new objects.User();
        });
  }

  /** Return information about selected user by its id
   *
   * @param userId  {string}
   */
  details(userId) {
    return this.call.get(`/users/${userId}`)
        .then((result) => new objects.User(result))
        .catch((error) => {
          /* TODO: log the error */
          return new objects.User();
        });
  }

  /** Update information about selected user by its id
   *  with data as new user information
   *
   * @param userId  {string}
   * @param data    {object}
   */
  update(userId, data) {
    return this.call.put(`/users/${userId}`, data)
        .then((result) => new objects.User(result))
        .catch((error) => {
          /* TODO: log the error */
          return new objects.User();
        });
  }

  /** Update a specific part of information about
   *  selected user by its id with data as information
   *
   * @param userId  {string}
   * @param data    {object}
   */
  patch(userId, data) {
    return this.call.patch(`/users/${userId}`, data)
        .then((result) => new objects.User(result))
        .catch((error) => {
          /* TODO: log the error */
          return new objects.User();
        });
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
        .then((result) => new objects.User(result))
        .catch((error) => {
          /* TODO: log the error */
          return new objects.User();
        });
  }
}

module.exports = ChinoAPIUsers;