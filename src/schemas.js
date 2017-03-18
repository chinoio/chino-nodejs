/**
 * Created by daniele on 22/02/17.
 */
"use strict";

const objects = require("./objects");
const ChinoAPIBase = require("./chinoBase");

class ChinoAPISchemas extends ChinoAPIBase {
  /** Create a caller for Schemas Chino APIs
   *
   * @param baseUrl     {string}  The url endpoint for APIs
   * @param customerId  {string}  The Chino customer id or bearer token
   * @param customerKey {string | null}  The Chino customer key or null (not provided)
   */
  constructor(baseUrl, customerId, customerKey = null) {
    super(baseUrl, customerId, customerKey);
  }

  /** Return a list of current schemas inside the repository
   *  selected by its id
   *
   * @param repositoryId  {string}
   * @param offset        {int}
   * @param limit         {int}
   * @return {Promise.<Array, objects.ChinoError>}
   *         A promise that return a list of Schema object if resolved,
   *         otherwise throw an ChinoError object if rejected
   *         or was not retrieved a success status
   */
  list(repositoryId, offset = 0, limit = 10) {
    const params = {
      offset : offset,
      limit : limit
    };

    return this.call.get(`/repositories/${repositoryId}/schemas`, params)
        .then((result) => {
          if (result.result_code === 200) {
            return new objects.ChinoList(result.data, objects.names.SCHEMAS[1], "Schema");
          }
          else {
            throw new objects.ChinoError(result);
          }
        })

        .catch((error) => { throw new objects.ChinoError(error); });
  }

  /** Create a new schema inside repository selected by its id
   *  with data as schema information
   *
   * @param repositoryId  {string}
   * @param data          {object}
   * @return {Promise.<objects.Schema, objects.ChinoError>}
   *         A promise that return a Schema object if resolved,
   *         otherwise throw an ChinoError object if rejected
   *         or was not retrieved a success status
   */
  create(repositoryId, data) {
    return this.call.post(`/repositories/${repositoryId}/schemas`, data)
        .then((result) => {
          if (result.result_code === 200) {
            return new objects.Schema(result);
          }
          else {
            throw new objects.ChinoError(result);
          }
        })
        .catch((error) => { throw new objects.ChinoError(error); });
  }

  /** Return information about schema selected by its id
   *
   * @param schemaId  {string}
   * @return {Promise.<objects.Schema, objects.ChinoError>}
   *         A promise that return a Schema object if resolved,
   *         otherwise throw an ChinoError object if rejected
   *         or was not retrieved a success status
   */
  details(schemaId) {
    return this.call.get(`/schemas/${schemaId}`)
        .then((result) => {
          if (result.result_code === 200) {
            return new objects.Schema(result);
          }
          else {
            throw new objects.ChinoError(result);
          }
        })
        .catch((error) => { throw new objects.ChinoError(error); });
  }

  /** Update information about schema selected by its id
   *  with data as new schema information
   *
   * @param schemaId  {string}
   * @param data      {object}
   * @return {Promise.<objects.Schema, objects.ChinoError>}
   *         A promise that return a Schema object if resolved,
   *         otherwise throw an ChinoError object if rejected
   *         or was not retrieved a success status
   */
  update(schemaId, data) {
    return this.call.put(`/schemas/${schemaId}`, data)
        .then((result) => {
          if (result.result_code === 200) {
            return new objects.Schema(result);
          }
          else {
            throw new objects.ChinoError(result);
          }
        })
        .catch((error) => { throw new objects.ChinoError(error); });
  }

  /** Deactivate (or delete) schema selected by its id
   *
   * @param schemaId    {string}
   * @param force       {boolean} If true delete schema information
   *                              otherwise only deactivate it.
   *                              Default value is false (deactivate)
   * @param all_content {boolean} If true all the documents inside
   *                              the schema will deleted otherwise
   *                              it is not possible to delete a schema
   *                              unless is empty. Default value is false.
   * @return {Promise.<objects.Success, objects.ChinoError>}
   *         A promise that return a Success object if resolved,X
   *         otherwise throw an ChinoError object if rejected
   *         or was not retrieved a success status
   */
  delete(schemaId, force = false, allContent = false) {
    const params = {
      force : force,
      all_content : allContent
    };

    return this.call.del(`/schemas/${schemaId}`, params)
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

module.exports = ChinoAPISchemas;