/**
 * Created by daniele on 28/02/17.
 */
"use strict";

const objects = require("./objects");
const ChinoAPIBase = require("./chinoBase");

class ChinoAPIApplication extends ChinoAPIBase {
  /** Create a caller for Applications Chino APIs
   *
   * @param baseUrl     {string}  The url endpoint for APIs
   * @param customerId  {string}  The Chino customer id or bearer token
 * @param customerKey {string | null}  The Chino customer key or null (not provided)
   */
  constructor(baseUrl, customerId, customerKey = null) {
    super(baseUrl, customerId, customerKey);
  }

  /** Return the list of existing applications
   *
   * @return {Promise.<Array, objects.Error>}
   *         A promise that return a list of Application object if resolved,
   *         otherwise throw an Error object if rejected
   *         or was not retrieved a success status
   *
   */
  list() {
    let applications = [];

    return this.call.get(`/auth/applications`)
        .then((result) => {
          if (result.result_code === 200) {
            result.data.applications.forEach((aInfo) => {
              let aData = {
                data : {
                  application : aInfo
                },
                result_code : result.result_code
              };

              applications.push(new objects.Application(aData));
            })

            return applications;
          }
          else {
            throw new objects.Error(result);
          }
        })
        .catch((error) => { throw new objects.Error(error); });
  }

  /** Create a new application
   *
   * @param data          {object}
   * @return {Promise.<objects.Application, objects.Error>}
   *         A promise that return a Application object if resolved,
   *         otherwise throw an Error object if rejected
   *         or was not retrieved a success status
   */
  create(data) {
    return this.call.post(`/auth/applications`, data)
        .then((result) => {
          if (result.result_code === 200) {
            return new objects.Application(result);
          }
          else {
            throw new objects.Error(result);
          }
        })
        .catch((error) => { throw new objects.Error(error); });
  }

  /** Return information about application selected by its id
   *
   * @param applicationId  {string}
   * @return {Promise.<objects.Application, objects.Error>}
   *         A promise that return a Application object if resolved,
   *         otherwise throw an Error object if rejected
   *         or was not retrieved a success status
   */
  details(applicationId) {
    return this.call.get(`/auth/applications/${applicationId}`)
        .then((result) => {
          if (result.result_code === 200) {
            return new objects.Application(result);
          }
          else {
            throw new objects.Error(result);
          }
        })
        .catch((error) => { throw new objects.Error(error); });
  }

  /** Update information about application selected by its id
   *  with data as new application information
   *
   * @param applicationId  {string}
   * @param data           {object}
   * @return {Promise.<objects.Application, objects.Error>}
   *         A promise that return a Application object if resolved,
   *         otherwise throw an Error object if rejected
   *         or was not retrieved a success status
   */
  update(applicationId, data) {
    return this.call.put(`/auth/applications/${applicationId}`, data)
        .then((result) => {
          if (result.result_code === 200) {
            return new objects.Application(result);
          }
          else {
            throw new objects.Error(result);
          }
        })
        .catch((error) => { throw new objects.Error(error); });
  }

  /** Delete application selected by its id
   *
   * @param applicationId {string}
   * @return {Promise.<objects.Success, objects.Error>}
   *         A promise that return a Success object if resolved,
   *         otherwise throw an Error object if rejected
   *         or was not retrieved a success status
   */
  delete(applicationId) {
    return this.call.del(`/auth/applications/${applicationId}`)
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

module.exports = ChinoAPIApplication;