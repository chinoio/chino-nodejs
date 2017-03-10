"use strict";

const objects = require("./objects");
const ChinoAPIBase = require("./chinoBase");

class ChinoAPIDocuments extends ChinoAPIBase {
  /** Create a caller for Documents Chino APIs
   *
   * @param baseUrl     {string}  The url endpoint for APIs
   * @param customerId  {string}  The Chino customer id or bearer token
   * @param customerKey {string | null}  The Chino customer key or null (not provided)
   */
  constructor(baseUrl, customerId, customerKey = null) {
    super(baseUrl, customerId, customerKey);
  }

  /** Return a list of current documents inside the schema
   *  selected by its id
   *
   * @param schemaId      {string}
   * @param offset        {int}
   * @param limit         {int}
   * @param fullDocument  {boolean} It specify if the documents inside
   *                                the list should show their content (true)
   *                                or not (false). By default it show only
   *                                documents information (false)
   * @return {Promise.<Array, objects.ChinoError>}
   *         A promise that return a list of Document object if resolved,
   *         otherwise throw an ChinoError object if rejected
   *         or was not retrieved a success status
   */
  list(schemaId, offset = 0, limit = 10, fullDocument = false) {
    const params = {
      full_document : fullDocument,
      offset : offset,
      limit : limit
    };

    return this.call.get(`/schemas/${schemaId}/documents`, params)
        .then((result) => {
          if (result.result_code === 200) {
            return objects.getList(result.data.documents, "Document");
          }
          else {
            throw new objects.ChinoError(result);
          }
        })

        .catch((error) => { throw new objects.ChinoError(error); });
  }

  /** Create a new document inside schema selected by its id
   *  with data as document information
   *
   * @param schemaId  {string}
   * @param data      {object}
   * @return {Promise.<objects.Document, objects.ChinoError>}
   *         A promise that return a Document object if resolved,
   *         otherwise throw an ChinoError object if rejected
   *         or was not retrieved a success status
   */
  create(schemaId, data) {
    return this.call.post(`/schemas/${schemaId}/documents`, data)
        .then((result) => {
          if (result.result_code === 200) {
            return new objects.Document(result);
          }
          else {
            throw new objects.ChinoError(result);
          }
        })
        .catch((error) => { throw new objects.ChinoError(error); });
  }

  /** Return information about document selected by its id
   *
   * @param documentId  {string}
   * @return {Promise.<objects.Document, objects.ChinoError>}
   *         A promise that return a Document object if resolved,
   *         otherwise throw an ChinoError object if rejected
   *         or was not retrieved a success status
   */
  details(documentId) {
    return this.call.get(`/documents/${documentId}`)
        .then((result) => {
          if (result.result_code === 200) {
            return new objects.Document(result);
          }
          else {
            throw new objects.ChinoError(result);
          }
        })
        .catch((error) => { throw new objects.ChinoError(error); });
  }

  /** Update information about document selected by its id
   *  with data as new document information
   *
   * @param documentId  {string}
   * @param data        {object}
   * @return {Promise.<objects.Document, objects.ChinoError>}
   *         A promise that return a Document object if resolved,
   *         otherwise throw an ChinoError object if rejected
   *         or was not retrieved a success status
   */
  update(documentId, data) {
    return this.call.put(`/documents/${documentId}`, data)
        .then((result) => {
          if (result.result_code === 200) {
            return new objects.Document(result);
          }
          else {
            throw new objects.ChinoError(result);
          }
        })
        .catch((error) => { throw new objects.ChinoError(error); });
  }

  /** Deactivate (or delete) document selected by its id
   *
   * @param documentId  {string}
   * @param force       {boolean} If true delete document information
   *                              otherwise only deactivate it.
   *                              Default value is false (deactivate)
   * @return {Promise.<objects.Success, objects.ChinoError>}
   *         A promise that return a Success object if resolved,X
   *         otherwise throw an ChinoError object if rejected
   *         or was not retrieved a success status
   */
  delete(documentId, force = false) {
    const params = { force : force };

    return this.call.del(`/documents/${documentId}`, params)
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

module.exports = ChinoAPIDocuments;