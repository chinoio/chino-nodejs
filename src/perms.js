/**
 * Created by daniele on 22/02/17.
 */
"use strict";

const objects = require("./objects");
const ChinoAPIBase = require("./chinoBase");

class ChinoAPIPerms extends ChinoAPIBase {
  /** Create a caller for Permissions Chino APIs
   *
   * @param baseUrl     {string}  The url endpoint for APIs
   * @param customerId  {string}  The Chino customer id or bearer token
   * @param customerKey {string | null}  The Chino customer key or null (not provided)
   */
  constructor(baseUrl, customerId, customerKey = null) {
    super(baseUrl, customerId, customerKey);
  }

  /** Grant or revoke permission on resources objects
   *
   * @param action         {string}
   * @param resourcesType  {string}
   * @param subjectType    {string}
   * @param subjectId      {string}
   * @param perms          {object}
   * @returns {Promise.<TResult>}
   */
  onResources(action, resourcesType, subjectType, subjectId, perms) {
    return this.call.post(`/perms/${action}/${resourcesType}/${subjectType}/${subjectId}`, perms)
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

  /** Grant or revoke permission on resource objects
   *
   * @param action        {string}
   * @param resourceType  {string}
   * @param resourcesId   {string}
   * @param subjectType   {string}
   * @param subjectId     {string}
   * @param perms         {object}
   * @returns {Promise.<TResult>}
   */
  onResource(action, resourceType, resourcesId, subjectType, subjectId, perms) {
    return this.call.post(`/perms/${action}/${resourceType}/${resourcesId}/${subjectType}/${subjectId}`, perms)
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

  /** Grant or revoke permission on resource children objects
   *
   * @param action        {string}
   * @param resourceType  {string}
   * @param resourcesId   {string}
   * @param childrenType  {string}
   * @param subjectType   {string}
   * @param subjectId     {string}
   * @param perms         {object}
   * @returns {Promise.<TResult>}
   */
  onChildren(action, resourceType, resourcesId, childrenType, subjectType, subjectId, perms) {
    return this.call.post(`/perms/${action}/${resourceType}/${resourcesId}/${childrenType}/${subjectType}/${subjectId}`, perms)
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


  // TODO: check code duplication

  /** Return permissions on all the resources
   *
   * @return {Promise.<Array, objects.Error>}
   *         A promise that return a list of Perms object if resolved,
   *         otherwise throw an Error object if rejected
   *         or was not retrieved a success status
   */
  getPermissions() {
    let permissions = [];

    return this.call.get(`/perms`)
        .then((result) => {
          if (result.result_code === 200) {
            result.data.permissions.forEach((permsInfo) => {
              let permsData = {
                data : {
                  permissions : permsInfo
                },
                result_code : result.result_code
              };

              permissions.push(new objects.Perms(permsData));
            })

            return permissions;
          }
          else {
            throw new objects.Error(result);
          }
        })
        .catch((error) => { throw new objects.Error(error); });
  }

  /** Return permissions on selected document
   *
   * @param documentId {string}
   * @return {Promise.<Array, objects.Error>}
   *         A promise that return a list of Perms object if resolved,
   *         otherwise throw an Error object if rejected
   *         or was not retrieved a success status
   */
  getDocumentPermissions(documentId) {
    let permissions = [];

    return this.call.get(`/perms/documents/${documentId}`)
        .then((result) => {
          if (result.result_code === 200) {
            result.data.permissions.forEach((permsInfo) => {
              let permsData = {
                data : {
                  permissions : permsInfo
                },
                result_code : result.result_code
              };

              permissions.push(new objects.Perms(permsData));
            })

            return permissions;
          }
          else {
            throw new objects.Error(result);
          }
        })
        .catch((error) => { throw new objects.Error(error); });
  }

  /** Return permissions on selected user
   *
   * @param userId {string}
   * @return {Promise.<Array, objects.Error>}
   *         A promise that return a list of Perms object if resolved,
   *         otherwise throw an Error object if rejected
   *         or was not retrieved a success status
   */
  getUserPermissions(userId) {
    let permissions = [];

    return this.call.get(`/perms/users/${userId}`)
        .then((result) => {
          if (result.result_code === 200) {
            result.data.permissions.forEach((permsInfo) => {
              let permsData = {
                data : {
                  permissions : permsInfo
                },
                result_code : result.result_code
              };

              permissions.push(new objects.Perms(permsData));
            })

            return permissions;
          }
          else {
            throw new objects.Error(result);
          }
        })
        .catch((error) => { throw new objects.Error(error); });
  }

  /** Return permissions on selected group
   *
   * @param groupId {string}
   * @return {Promise.<Array, objects.Error>}
   *         A promise that return a list of Perms object if resolved,
   *         otherwise throw an Error object if rejected
   *         or was not retrieved a success status
   */
  getGroupPermissions(groupId) {
    let permissions = [];

    return this.call.get(`/perms/groups/${groupId}`)
        .then((result) => {
          if (result.result_code === 200) {
            result.data.permissions.forEach((permsInfo) => {
              let permsData = {
                data : {
                  permissions : permsInfo
                },
                result_code : result.result_code
              };

              permissions.push(new objects.Perms(permsData));
            })

            return permissions;
          }
          else {
            throw new objects.Error(result);
          }
        })
        .catch((error) => { throw new objects.Error(error); });
  }
}

module.exports = ChinoAPIPerms;