"use strict";

const objects = require("./objects");
const ChinoAPIBase = require("./chinoBase");

/** Convert a response into a list of Perms object
 *
 * @param response
 * @param status_code
 * @returns {Array.<objects.Perms>}
 */
function listPermissions(response) {
  if (response.result_code === 200) {
    return response.data.permissions.map((permsInfo) =>
        new objects.Perms(
            {
              data: {
                permissions: permsInfo
              },
              result_code: response.result_code
            }
        )
    );
  }
  else {
    throw new objects.ChinoError(response);
  }
}

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
   * @param data {object}
   *        A JS object that contains parameters for working on permissions. Parameters are:
   *     - action        {string} The permission action to execute                    {grant | revoke}
   *     - resourcesType {string} The top level resource on which execute the action  {repositories | user_schemas | groups}
   *     - subjectType   {string} The target type of permission action                {users | user_schemas | groups}
   *     - subjectId     {string} The id of the target type
   *     - permissions   {object} Which permissions have to granted or revoked
   *
   * @returns {Promise.<objects.Success, objects.ChinoError>}
   *          A promise that return a Success object if resolved,
   *          otherwise throw a ChinoError if rejected
   *          or was not retrieved a success status
   */
  onResources({action, resourcesType, subjectType, subjectId, permissions = {}}) {
    const url = `/perms/${action}/${resourcesType}/${subjectType}/${subjectId}`;

    return this.call.post(url, permissions)
        .then((result) => objects.checkResult(result, "Success"))
        .catch((error) => { throw new objects.ChinoError(error); });
  }

  /** Grant or revoke permission on resource objects
   *
   * @param data {object}
   *        A JS object that contains parameters for working on permissions. Parameters are:
   *     - action        {string} The permission action to execute         {grant | revoke}
   *     - resourceType  {string} The resource on which execute the action
   *     - resourceId    {string} The id of the resource on which target can manage
   *     - subjectType   {string} The target type of permission action     {users | user_schemas | groups}
   *     - subjectId     {string} The id of the target type
   *     - permissions   {object} Which permissions have to granted or revoked
   *
   * @returns {Promise.<objects.Success, objects.ChinoError>}
   *          A promise that return a Success object if resolved,
   *          otherwise throw a ChinoError if rejected
   *          or was not retrieved a success status
   */
  onResource({action, resourceType, resourceId, subjectType, subjectId, permissions = {}}) {
    const url = `/perms/${action}/${resourceType}/${resourceId}/${subjectType}/${subjectId}`;

    return this.call.post(url, permissions)
        .then((result) => objects.checkResult(result, "Success"))
        .catch((error) => { throw new objects.ChinoError(error); });
  }

  /** Grant or revoke permission on resource children objects
   *
   * @param data {object}
   *        A JS object that contains parameters for working on permissions. Parameters are:
   *     - action        {string} The permission action to execute                      {grant | revoke}
   *     - resourceType  {string} The resource on which execute the action
   *     - resourceId    {string} The id of the resource on which target can manage
   *     - childrenType  {string} The resource children of resource type on target can manage
   *     - subjectType   {string} The target type of permission action                  {users | user_schemas | groups}
   *     - subjectId     {string} The id of the target type
   *     - permissions   {object} Which permissions have to granted or revoked
   *
   * @returns {Promise.<objects.Success, objects.ChinoError>}
   *          A promise that return a Success object if resolved,
   *          otherwise throw a ChinoError if rejected
   *          or was not retrieved a success status
   */
  onChildren({action, resourceType, resourceId, childrenType, subjectType, subjectId, permissions = {}}) {
    const url = `/perms/${action}/${resourceType}/${resourceId}/${childrenType}/${subjectType}/${subjectId}`;

    return this.call.post(url, permissions)
        .then((result) => objects.checkResult(result, "Success"))
        .catch((error) => { throw new objects.ChinoError(error); });
  }

  /** Return permissions on all the resources
   *
   * @return {Promise.<Array, objects.ChinoError>}
   *         A promise that return a list of Perms object if resolved,
   *         otherwise throw a ChinoError object if rejected
   *         or was not retrieved a success status
   */
  getPermissions() {
    // ATTENTION => this works only for application users (not app developer)
    return this.call.get(`/perms`)
        .then((result) => listPermissions(result))
        .catch((error) => { throw new objects.ChinoError(error); });
  }

  /** Return permissions on selected document
   *
   * @param documentId {string}
   * @return {Promise.<Array, objects.ChinoError>}
   *         A promise that return a list of Perms object if resolved,
   *         otherwise throw a ChinoError if rejected
   *         or was not retrieved a success status
   */
  getDocumentPermissions(documentId) {
    return this.call.get(`/perms/documents/${documentId}`)
        .then((result) => listPermissions(result))
        .catch((error) => { throw new objects.ChinoError(error); });
  }

  /** Return permissions on selected user
   *
   * @param userId {string}
   * @return {Promise.<Array, objects.ChinoError>}
   *         A promise that return a list of Perms object if resolved,
   *         otherwise throw a ChinoError if rejected
   *         or was not retrieved a success status
   */
  getUserPermissions(userId) {
    return this.call.get(`/perms/users/${userId}`)
        .then((result) => listPermissions(result))
        .catch((error) => { throw new objects.ChinoError(error); });
  }

  /** Return permissions on selected group
   *
   * @param groupId {string}
   * @return {Promise.<Array, objects.ChinoError>}
   *         A promise that return a list of Perms object if resolved,
   *         otherwise throw a ChinoError if rejected
   *         or was not retrieved a success status
   */
  getGroupPermissions(groupId) {
    return this.call.get(`/perms/groups/${groupId}`)
        .then((result) => listPermissions(result))
        .catch((error) => { throw new objects.ChinoError(error); });
  }
}

module.exports = ChinoAPIPerms;