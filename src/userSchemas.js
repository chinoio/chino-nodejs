"use strict";

const objects = require("./objects");
const ChinoAPIBase = require("./chinoBase");

class ChinoAPIUserSchemas extends ChinoAPIBase {
  /** Create a caller for User Schemas Chino APIs
   *
   * @param baseUrl     {string}  The url endpoint for APIs
   * @param customerId  {string}  The Chino customer id or bearer token
   * @param customerKey {string | null}  The Chino customer key or null (not provided)
   */
  constructor(baseUrl, customerId, customerKey = null) {
    super(baseUrl, customerId, customerKey);
  }

  /** Return the list of current user schemas
   *
   * @param offset  {int}
   * @param limit   {int}
   * @return {Promise.<Array, objects.ChinoError>}
   *         A promise that return a list of UserSchema object if resolved,
   *         otherwise throw an ChinoError object if rejected
   *         or was not retrieved a success status
   *
   */
  list(offset = 0, limit = 10) {
    const params = {
      offset : offset,
      limit : limit
    }

    return this.call.get(`/user_schemas`, params)
        .then((result) => {
          if (result.result_code === 200) {
            return result.data.user_schemas.map((value) =>
                new objects.UserSchema({
                  data : {
                    user_schema : value
                  },
                  result_code : result.result_code
                }));
          }
          else {
            throw new objects.ChinoError(result);
          }
        })
        .catch((error) => { throw new objects.ChinoError(error); });
  }

  /** Create a new user schema
   *
   * @param data          {object}
   * @return {Promise.<objects.UserSchema, objects.ChinoError>}
   *         A promise that return a UserSchema object if resolved,
   *         otherwise throw an ChinoError object if rejected
   *         or was not retrieved a success status
   */
  create(data) {
    return this.call.post(`/user_schemas`, data)
        .then((result) => {
          if (result.result_code === 200) {
            return new objects.UserSchema(result);
          }
          else {
            throw new objects.ChinoError(result);
          }
        })
        .catch((error) => { throw new objects.ChinoError(error); });
  }

  /** Return information about user schema selected by its id
   *
   * @param userSchemaId  {string}
   * @return {Promise.<objects.UserSchema, objects.ChinoError>}
   *         A promise that return a User object if resolved,
   *         otherwise throw an ChinoError object if rejected
   *         or was not retrieved a success status
   */
  details(userSchemaId) {
    return this.call.get(`/user_schemas/${userSchemaId}`)
        .then((result) => {
          if (result.result_code === 200) {
            return new objects.UserSchema(result);
          }
          else {
            throw new objects.ChinoError(result);
          }
        })
        .catch((error) => { throw new objects.ChinoError(error); });
  }

  /** Update information about user schema selected by its id
   *  with data as new user schema information
   *
   * @param userSchemaId  {string}
   * @param data          {object}
   * @return {Promise.<objects.UserSchema, objects.ChinoError>}
   *         A promise that return a User object if resolved,
   *         otherwise throw an ChinoError object if rejected
   *         or was not retrieved a success status
   */
  update(userSchemaId, data) {
    return this.call.put(`/user_schemas/${userSchemaId}`, data)
        .then((result) => {
          if (result.result_code === 200) {
            return new objects.UserSchema(result);
          }
          else {
            throw new objects.ChinoError(result);
          }
        })
        .catch((error) => { throw new objects.ChinoError(error); });
  }

  /** Deactivate (or delete) user schema selected by its id
   *
   * @param userSchemaId  {string}
   * @param force         {boolean} If true delete user schema information
   *                                otherwise only deactivate it.
   *                                Default value is false (deactivate)
   * @return {Promise.<objects.Success, objects.ChinoError>}
   *         A promise that return a Success object if resolved,
   *         otherwise throw an ChinoError object if rejected
   *         or was not retrieved a success status
   */
  delete(userSchemaId, force = false) {
    const params = { force : force };

    return this.call.del(`/user_schemas/${userSchemaId}`, params)
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

module.exports = ChinoAPIUserSchemas;