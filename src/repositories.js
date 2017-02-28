/**
 * Created by daniele on 22/02/17.
 */
"use strict";

const objects = require("./objects");
const ChinoAPIBase = require("./chinoBase");

class ChinoAPIRepositories extends ChinoAPIBase {
  /** Create a caller for Repositories Chino APIs
   *
   * @param baseUrl     {string}  The url endpoint for APIs
   * @param customerId  {string}  The Chino customer id or bearer token
   * @param customerKey {string}  The Chino customer key or null (not provided)
   */
  constructor(baseUrl, customerId, customerKey = null) {
    super(baseUrl, customerId, customerKey);
  }

  /** Return the list of existing repositories
   *
   * @return {Promise.<Array, objects.Error>}
   *         A promise that return a list of Repository object if resolved,
   *         otherwise throw an Error object if rejected
   *         or was not retrieved a success status
   *
   */
  list() {
    let repositories = [];

    return this.call.get(`/repositories`)
        .then((result) => {
          if (result.result_code === 200) {
            result.data.repositories.forEach((rInfo) => {
              let rData = {
                data : {
                  repository : rInfo
                },
                result_code : result.result_code
              };

              repositories.push(new objects.Repository(rData));
            })

            return repositories;
          }
          else {
            throw new objects.Error(result);
          }
        })
        .catch((error) => { throw new objects.Error(error); });
  }

  /** Create a new repository
   *
   * @param data          {object}
   * @return {Promise.<objects.Repository, objects.Error>}
   *         A promise that return a Repository object if resolved,
   *         otherwise throw an Error object if rejected
   *         or was not retrieved a success status
   */
  create(data) {
    return this.call.post(`/repositories`, data)
        .then((result) => {
          if (result.result_code === 200) {
            return new objects.Repository(result);
          }
          else {
            throw new objects.Error(result);
          }
        })
        .catch((error) => { throw new objects.Error(error); });
  }

  /** Return information about repository selected by its id
   *
   * @param repositoryId  {string}
   * @return {Promise.<objects.Repository, objects.Error>}
   *         A promise that return a Repository object if resolved,
   *         otherwise throw an Error object if rejected
   *         or was not retrieved a success status
   */
  details(repositoryId) {
    return this.call.get(`/repositories/${repositoryId}`)
        .then((result) => {
          if (result.result_code === 200) {
            return new objects.Repository(result);
          }
          else {
            throw new objects.Error(result);
          }
        })
        .catch((error) => { throw new objects.Error(error); });
  }

  /** Update information about repository selected by its id
   *  with data as new repository information
   *
   * @param repositoryId  {string}
   * @param data          {object}
   * @return {Promise.<objects.Repository, objects.Error>}
   *         A promise that return a Repository object if resolved,
   *         otherwise throw an Error object if rejected
   *         or was not retrieved a success status
   */
  update(repositoryId, data) {
    return this.call.put(`/repositories/${repositoryId}`, data)
        .then((result) => {
          if (result.result_code === 200) {
            return new objects.Repository(result);
          }
          else {
            throw new objects.Error(result);
          }
        })
        .catch((error) => { throw new objects.Error(error); });
  }

  /** Deactivate (or delete) repository selected by its id
   *
   * @param repositoryId {string}
   * @param force        {bool}   If true delete repository information
   *                              otherwise only deactivate it.
   *                              Default value is false (deactivate)
   * @return {Promise.<objects.Success, objects.Error>}
   *         A promise that return a Success object if resolved,
   *         otherwise throw an Error object if rejected
   *         or was not retrieved a success status
   */
  delete(repositoryId, force = false) {
    const url = force
        ? `/repositories/${repositoryId}?force=true`
        : `/repositories/${repositoryId}`;

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

module.exports = ChinoAPIRepositories;