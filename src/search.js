/**
 * Created by daniele on 22/02/17.
 */
"use strict";

const objects = require("./objects");
const RESULT_TYPES = require("./resultTypes");
const ChinoAPIBase = require("./chinoBase");

class ChinoAPISearch extends ChinoAPIBase {
  /** Create a caller for Search Chino APIs
   *
   * @param baseUrl     {string}  The url endpoint for APIs
   * @param customerId  {string}  The Chino customer id or bearer token
   * @param customerKey {string | null}  The Chino customer key or null (not provided)
   */
  constructor(baseUrl, customerId, customerKey = null) {
    super(baseUrl, customerId, customerKey);
  }

  /** Return all matching documents inside selected schema
   *
   * @param schemaId      {string}
   * @param searchParams  {object}
   * @return {Promise.<Array, objects.Error>}
   *         A promise that return a list of Document objects if resolved,
   *         otherwise throw an Error object if rejected
   *         or was not retrieved a success status
   */
  documents(schemaId, searchParams) {
    let documents = [];

    switch (searchParams.result_type) {
      case RESULT_TYPES.FULL_CONTENT:
      case RESULT_TYPES.NO_CONTENT:
        return this.call.post(`/search/documents/${schemaId}`, searchParams)
            .then((result) => {
              if (result.result_code === 200) {
                result.data.documents.forEach((dInfo) => {
                  let dData = {
                    data : {
                      document : dInfo
                    },
                    result_code : result.result_code
                  };

                  documents.push(new objects.Document(dData));
                })

                return documents;
              }
              else {
                throw new objects.Error(result);
              }
            })
            .catch((error) => { throw new objects.Error(error); });

      case RESULT_TYPES.ONLY_ID:
        return this.call.post(`/search/documents/${schemaId}`, searchParams)
            .then((result) => {
              if (result.result_code === 200) {
                return new objects.Success(result);
              }
              else {
                throw new objects.Error(result);
              }
            })
            .catch((error) => { throw new objects.Error(error); });

      case RESULT_TYPES.COUNT:
        return this.call.post(`/search/documents/${schemaId}`, searchParams)
            .then((result) => {
              if (result.result_code === 200) {
                return new objects.Success(result);
              }
              else {
                throw new objects.Error(result);
              }
            })
            .catch((error) => { throw new objects.Error(error); });

      default:
        throw new objects.Error("Wrong result type used. See docs for further information.");
    }


  }

  /** Return all matching user inside selected user schema
   *
   * @param userSchemaId  {string}
   * @param searchParams  {object}
   * @return {Promise.<Array, objects.Error>}
   *         A promise that return a list of Document objects if resolved,
   *         otherwise throw an Error object if rejected
   *         or was not retrieved a success status
   */
  users(userSchemaId, searchParams) {
    let users = [];

    switch (searchParams.result_type) {
      case RESULT_TYPES.FULL_CONTENT:
        return this.call.post(`/search/users/${userSchemaId}`, searchParams)
            .then((result) => {
              if (result.result_code === 200) {
                result.data.users.forEach((uInfo) => {
                  let uData = {
                    data: {
                      user: uInfo
                    },
                    result_code: result.result_code
                  };

                  users.push(new objects.Document(uData));
                })

                return users;
              }
              else {
                throw new objects.Error(result);
              }
            })
            .catch((error) => {
              throw new objects.Error(error);
            });

      case RESULT_TYPES.COUNT:
        return this.call.post(`/search/users/${userSchemaId}`, searchParams)
            .then((result) => {
              if (result.result_code === 200) {
                return new objects.Success(result);
              }
              else {
                throw new objects.Error(result);
              }
            })
            .catch((error) => {
              throw new objects.Error(error);
            });

      case RESULT_TYPES.EXISTS:
      case RESULT_TYPES.USERNAME_EXISTS:
        return this.call.post(`/search/users/${userSchemaId}`, searchParams)
            .then((result) => {
              if (result.result_code === 200) {
                return new objects.Success(result);
              }
              else {
                throw new objects.Error(result);
              }
            }) // directly return true or false
            .catch((error) => {
              throw new objects.Error(error);
            });

      default:
        throw new objects.Error("Wrong result type used. See docs for further information.");
    }
  }
}

module.exports = ChinoAPISearch;