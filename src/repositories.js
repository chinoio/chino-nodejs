"use strict";

const objects = require("./objects");
const ChinoAPIBase = require("./chinoBase");

class ChinoAPIRepositories extends ChinoAPIBase {
  /** Create a caller for Repositories Chino APIs
   *
   * @param baseUrl     {string}  The url endpoint for APIs
   * @param customerId  {string}  The Chino customer id or bearer token
   * @param customerKey {string | null}  The Chino customer key or null (not provided)
   */
  constructor(baseUrl, customerId, customerKey = null) {
    super(baseUrl, customerId, customerKey);
  }

  /** Return the list of existing repositories
   *
   * @param offset  {int}
   * @param limit   {int}
   * @return {Promise.<Array, objects.ChinoException>}
   *         A promise that return a list of Repository object if resolved,
   *         otherwise throw an ChinoException object if rejected
   *         or was not retrieved a success status
   *
   */
  list(offset = 0, limit = 10) {
    const params = {
      offset : offset,
      limit : limit
    };

    return this.call.get(`/repositories`, params)
        .then((result) => objects.checkListResult(result, "repositories", "Repository"))
        .catch((error) => { throw new objects.ChinoException(error); });
  }

  /** Create a new repository
   *
   * @param data          {object}
   * @return {Promise.<objects.Repository, objects.ChinoException>}
   *         A promise that return a Repository object if resolved,
   *         otherwise throw an ChinoException object if rejected
   *         or was not retrieved a success status
   */
  create(data) {
    return this.call.post(`/repositories`, data)
        .then((result) => objects.checkResult(result, "Repository"))
        .catch((error) => { throw new objects.ChinoException(error); });
  }

  /** Return information about repository selected by its id
   *
   * @param repositoryId  {string}
   * @return {Promise.<objects.Repository, objects.ChinoException>}
   *         A promise that return a Repository object if resolved,
   *         otherwise throw an ChinoException object if rejected
   *         or was not retrieved a success status
   */
  details(repositoryId) {
    return this.call.get(`/repositories/${repositoryId}`)
        .then((result) => objects.checkResult(result, "Repository"))
        .catch((error) => { throw new objects.ChinoException(error); });
  }

  /** Update information about repository selected by its id
   *  with data as new repository information
   *
   * @param repositoryId  {string}
   * @param data          {object}
   * @return {Promise.<objects.Repository, objects.ChinoException>}
   *         A promise that return a Repository object if resolved,
   *         otherwise throw an ChinoException object if rejected
   *         or was not retrieved a success status
   */
  update(repositoryId, data) {
    return this.call.put(`/repositories/${repositoryId}`, data)
        .then((result) => objects.checkResult(result, "Repository"))
        .catch((error) => { throw new objects.ChinoException(error); });
  }

  /** Deactivate (or delete) repository selected by its id
   *
   * @param repositoryId {string}
   * @param force        {boolean} If true delete repository information
   *                               otherwise only deactivate it.
   *                               Default value is false (deactivate)
   * @return {Promise.<objects.Success, objects.ChinoException>}
   *         A promise that return a Success object if resolved,
   *         otherwise throw an ChinoException object if rejected
   *         or was not retrieved a success status
   */
  delete(repositoryId, force = false) {
    const params = { force : force };

    return this.call.del(`/repositories/${repositoryId}`, params)
        .then((result) => objects.checkResult(result, "Success"))
        .catch((error) => { throw new objects.ChinoException(error); });
  }
}

module.exports = ChinoAPIRepositories;