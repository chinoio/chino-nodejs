"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const objects = require("./objects");
const ChinoAPIBase = require("./chinoBase");

/** Commit the upload action and return the blob information
 *
 * @param uploadId  {string}  The upload id representing an upload action
 * @return {Promise.<objects.Blob, objects.ChinoError>}
 *         A promise that return a Blob object if resolved,
 *         otherwise throw an ChinoError object if rejected
 *         or was not retrieved a success status
 */
function commit(uploadId) {
  const params = {
    upload_id : uploadId
  };

  return this.call.post(`/blobs/commit`, params)
      .then((result) => {
        if (result.result_code === 200) {
          return new objects.Blob(result);
        }
        else {
          throw new objects.ChinoError(result);
        }
      })
      .catch((error) => { throw new objects.ChinoError(error); });
}

/** Create a new blob
 *
 * @param info  {object} The parameter for the creation of a blob
 * @return {Promise}
 */
function create(info = {}) {
  return this.call.post(`/blobs`, info);
}

class ChinoAPIBlobs extends ChinoAPIBase {
  /** Create a caller for Groups Chino APIs
   *
   * @param baseUrl     {string}         The url endpoint for APIs
   * @param customerId  {string}         The Chino customer id or bearer token
   * @param customerKey {string | null}  The Chino customer key or null (not provided)
   */
  constructor(baseUrl, customerId, customerKey = null) {
    super(baseUrl, customerId, customerKey);
  }

  /** Upload a blob file
   *
   * @param docId     {string}
   * @param field     {string}
   * @param fileName  {string}
   * @return {Promise.<objects.Blob, objects.ChinoError>}
   *         A promise that return a BlobUncommitted object if resolved,
   *         otherwise throw an ChinoError object if rejected
   *         or was not retrieved a success status
   */
  upload(docId = "", field = "", fileName = "") {
    const info = {
      document_id : docId,
      field : field,
      file_name : fileName
    }

    let uploadId = "";
    
    function doUpload(resolve, reject) {
      create.call(this, info)
          .then((result) => {
            if (result.result_code === 200) {
              // get an id where upload blob data
              uploadId = result.data.blob.upload_id;

              // prepare to read file
              const options = {
                flags : "r",
                autoClose : true,
                highWaterMark : 16 * 1024
              };
              const readStream = fs.createReadStream(fileName, options);
              // hash for verifying blob integrity
              const hash = crypto.createHash('sha1');

              let chunks = [];
              let offset = 0;

              // read each chunk and upload it
              readStream.on('data', (chunk) => {
                let params = {
                  blob_offset : offset,
                  blob_length : chunk.length
                }

                // create an array of Promises upload
                chunks.push(this.call.chunk(`/blobs/${uploadId}`, chunk, params))

                hash.update(chunk);
                offset += chunk.length;
              });

              readStream.on('error', (error) => {
                throw new Error(`Error reading file:\n${error}`);
              });

              readStream.on('end', () =>
                  // wait upload of all chunks is completed
                  Promise.all(chunks)
                      .then((result) => {
                        if (result.every((res) => res.result_code === 200)) {
                          commit.call(this, uploadId)
                              .then((blob) => {
                                // attention: digest method can be called one for hash
                                if (blob.sha1 === hash.digest("hex")) {
                                  resolve(blob);
                                }
                                else {
                                  reject("Digest mismatch.");
                                }
                              })
                              .catch((error) => {
                                throw new objects.ChinoError(error);
                              });
                        }
                        else {
                          throw new objects.ChinoError(result);
                        }
                      })
                      .catch((error) => { throw new objects.ChinoError(error); })
              )
            }
            else {
              throw new objects.ChinoError(result);
            }
          })
          .catch((error) => { throw new objects.ChinoError(error); });
    }

    return new Promise(doUpload.bind(this))
  }

  /** Retrieve selected blob data and save it in the specified file
   *
   * @param blobId      {string}
   * @param newFileName {string}
   * @return {Promise.<objects.Success, Error>}
   *         A promise that return Blob object as Octet stream if resolved,
   *         otherwise throw an ChinoError object if rejected
   */
  download(blobId, newFileName = "") {
    function doDownload(resolve, reject) {
      const options = {
        flags : "w",
        autoClose : true,
        highWaterMark : 16 * 1024
      };
      const writer = fs.createWriteStream(newFileName, options);

      writer.on("finish", function () {
        const ok = {
          result_code: 200,
          result: "success",
          data : null,
          message : null
        };

        resolve(new objects.Success(ok));
      });

      writer.on("error", (error) => {
        reject(new Error("Writing blob raise an error:\n" + error));
      });

      this.call.getBlob(`/blobs/${blobId}`).pipe(writer);
    }

    if (!newFileName || newFileName === "") {
      const error = {
        message : "Missing file name for creating file from downloaded blob data.",
        result_code : 400,
        result : "error",
        data : null
      };
      throw new objects.ChinoError(error);
    }

    return new Promise(doDownload.bind(this));
  }

  /** Delete blob selected by its id
   *
   * @param blobId  {string}
   * @return {Promise.<objects.Success, objects.ChinoError>}
   *         A promise that return a Success object if resolved,
   *         otherwise throw an ChinoError object if rejected
   *         or was not retrieved a success status
   */
  delete(blobId) {
    const params = {};

    return this.call.del(`/blobs/${blobId}`, params)
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

module.exports = ChinoAPIBlobs;