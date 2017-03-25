"use strict";

const objects = require("./objects");
const ChinoAPIBase = require("./chinoBase");

class ChinoAPICollections extends ChinoAPIBase {
  /** Create a caller for Collections Chino APIs
   *
   * @param baseUrl     {string}  The url endpoint for APIs
   * @param customerId  {string}  The Chino customer id or bearer token
   * @param customerKey {string | null}  The Chino customer key or null (not provided)
   */
  constructor(baseUrl, customerId, customerKey = null) {
    super(baseUrl, customerId, customerKey);
  }

  /** Return a list of existing collections
   *
   * @param offset  {int}
   * @param limit   {int}
   * @return {Promise.<Array, objects.ChinoException>}
   *         A promise that return a list of Collection object if resolved,
   *         otherwise throw an ChinoException object if rejected
   *         or was not retrieved a success status
   */
  list(offset = 0, limit = 10) {
    const params = {
      offset : offset,
      limit : limit
    };

    return this.call.get(`/collections`, params)
        .then((result) => objects.checkListResult(result, "collections", "Collection"))
        .catch((error) => { throw new objects.ChinoException(error); });
  }

  /** Create a new collection
   *
   * @param data      {object}
   * @return {Promise.<objects.Collection, objects.ChinoException>}
   *         A promise that return a Collection object if resolved,
   *         otherwise throw an ChinoException object if rejected
   *         or was not retrieved a success status
   */
  create(data) {
    return this.call.post(`/collections`, data)
        .then((result) => objects.checkResult(result, "Collection"))
        .catch((error) => { throw new objects.ChinoException(error); });
  }

  /** Return information about collection selected by its id
   *
   * @param collectionId  {string}
   * @return {Promise.<objects.Collection, objects.ChinoException>}
   *         A promise that return a Collection object if resolved,
   *         otherwise throw an ChinoException object if rejected
   *         or was not retrieved a success status
   */
  details(collectionId) {
    return this.call.get(`/collections/${collectionId}`)
        .then((result) => objects.checkResult(result, "Collection"))
        .catch((error) => { throw new objects.ChinoException(error); });
  }

  /** Update information about collection selected by its id
   *  with data as new collection information
   *
   * @param collectionId  {string}
   * @param data        {object}
   * @return {Promise.<objects.Collection, objects.ChinoException>}
   *         A promise that return a Collection object if resolved,
   *         otherwise throw an ChinoException object if rejected
   *         or was not retrieved a success status
   */
  update(collectionId, data) {
    return this.call.put(`/collections/${collectionId}`, data)
        .then((result) => objects.checkResult(result, "Collection"))
        .catch((error) => { throw new objects.ChinoException(error); });
  }

  /** Deactivate (or delete) collection selected by its id
   *
   * @param collectionId  {string}
   * @param force       {boolean} If true delete collection information
   *                              otherwise only deactivate it.
   *                              Default value is false (deactivate)
   * @return {Promise.<objects.Success, objects.ChinoException>}
   *         A promise that return a Success object if resolved,
   *         otherwise throw an ChinoException object if rejected
   *         or was not retrieved a success status
   */
  delete(collectionId, force = false) {
    const params = { force : force };

    return this.call.del(`/collections/${collectionId}`, params)
        .then((result) => objects.checkResult(result, "Success"))
        .catch((error) => { throw new objects.ChinoException(error); });
  }

  /** Return a list of documents inside the collections
   *  selected by its id
   *
   * @param collectionId  {string}
   * @param offset        {int}
   * @param limit         {int}
   * @return {Promise.<Array, objects.ChinoException>}
   *         A promise that return a list of Documents object if resolved,
   *         otherwise throw an ChinoException object if rejected
   *         or was not retrieved a success status
   */
  listDocuments(collectionId, offset = 0, limit = 10) {
    const params = {
      offset : offset,
      limit : limit
    };

    return this.call.get(`/collections/${collectionId}/documents`, params)
        .then((result) => objects.checkListResult(result, "documents", "Document"))
        .catch((error) => { throw new objects.ChinoException(error); });
  }

  /** Insert a new document inside collection selected by their id
   *
   * @param collectionId  {string}
   * @param documentId    {string}
   * @return {Promise.<objects.Document, objects.ChinoException>}
   *         A promise that return a Success object if resolved,
   *         otherwise throw an ChinoException object if rejected
   *         or was not retrieved a success status
   */
  insertDocument(collectionId, documentId) {
    return this.call.post(`/collections/${collectionId}/documents/${documentId}`, {})
        .then((result) => objects.checkResult(result, "Success"))
        .catch((error) => { throw new objects.ChinoException(error); });
  }

  /** Insert a new document inside collection selected by their id
   *
   * @param collectionId  {string}
   * @param documentId    {string}
   * @return {Promise.<objects.Document, objects.ChinoException>}
   *         A promise that return a Success object if resolved,
   *         otherwise throw an ChinoException object if rejected
   *         or was not retrieved a success status
   */
  removeDocument(collectionId, documentId) {
    return this.call.del(`/collections/${collectionId}/documents/${documentId}`, {})
        .then((result) => objects.checkResult(result, "Success"))
        .catch((error) => { throw new objects.ChinoException(error); });
  }

  /** Search between collections filtering on name
   *
   * @param filter    {object}
   * @return {Promise.<objects.Document, objects.ChinoException>}
   *         A promise that return a list of Collection object
   *         matching filter if resolved, otherwise throw an ChinoException
   *         object if rejected or was not retrieved a success status
   */
  search(filter) {
    return this.call.post(`/collections/search`, filter)
        .then((result) => objects.checkListResult(result, "collections", "Collection"))
        .catch((error) => { throw new objects.ChinoException(error); });
  }
}

module.exports = ChinoAPICollections;