const assert = require("assert");
const should = require('should');

const fs = require("fs");
const path = require("path");
const Call = require("../../src/apiCall.js");
const Blobs = require("../../src/blobs");
const objects = require("../../src/objects");
const settings = require("./../testsSettings");

const baseUrl     = settings.baseUrl;
const customerId  = settings.customerId;
const customerKey = settings.customerKey;

describe('Chino Blobs API', function () {
    this.slow(300);
    // change timeout for slow network
    this.timeout(50000);

    const apiCall = new Call(baseUrl, customerId, customerKey);
    const blobCaller = new Blobs(baseUrl, customerId, customerKey);

    // keep track of id to delete it later
    let repoId = "";
    let schemaId = "";
    let docId = "";
    let blobId = "";

    before(function () {
        repoId = settings.data().repoId;

        const schema = {
            description: "Schema for testing Blob lib",
            structure: {
                fields: [
                    {
                        name: "ciao",
                        type: "string"
                    },
                    {
                        name: "number",
                        type: "integer"
                    },
                    {
                        name: "file",
                        type: "blob"
                    }
                ]
            }
        };
        const doc = {
            content : {
                ciao : "Hello! This is a blob test.",
                number : 3
            }
        };

        return apiCall.post(`/repositories/${repoId}/schemas`, schema)
            .then((res) => {
                schemaId = res.data.schema.schema_id;

                if (schemaId) {
                    return apiCall.post(`/schemas/${schemaId}/documents`, doc)
                        .then((res) => { docId = res.data.document.document_id; });
                }
            })
            .catch((err) => console.log(`Error inserting doc\n${JSON.stringify(err)}`));
    });

    /* upload */
    it("Test the upload of a blob: should return a Blob object",
        function (done) {
            this.slow(1500);
            this.timeout(60000); // for slow connection (e.g. 1Mbps upload)
            const fileName = path.join(__dirname, "files/img.jpg");

            blobCaller.upload(docId, "file", fileName)
                .then((result) => {
                    result.should.be.an.instanceOf(objects.Blob);
                    Object.keys(result).length.should.be.above(0);
                    blobId = result.blob_id;
                    return done();
                })
                .catch((error) => {
                    should.fail(error);
                    return done(error);
                });
        }
    );

    /* download */
    it("Test the retrieval of blob data: should write a file object",
        function (done) {
            this.slow(750);
            this.timeout(10000);

            const resultFile = path.join(__dirname, "files/result.jpg");

            blobCaller.download(blobId, resultFile)
                .then((result) => {
                    // check result file is visible
                    fs.access(resultFile, fs.constants.R_OK, (err) => {
                        if (err) {
                            throw new Error(err);
                        } else {
                            return done();
                        }
                    });
                })
                .catch((error) =>{
                    should.fail(error);
                    return done(error);
                });
        }
    );

    /* delete */
    it("Test the deletion of a blob data: should return a success message",
        function (done) {
            this.timeout(10000); // wait for blob creation

            blobCaller.delete(blobId)
                .then((result) => {
                    result.should.be.an.instanceOf(objects.Success);
                    result.result_code.should.be.equal(200);
                    return done();
                })
                .catch((error) => {
                    should.fail(error);
                    return done(error);
                });
        }
    );

    /* =================================== */
    /* Test what happen in wrong situation */
    describe("Test error situations:", function () {
        it("Upload file should throw a ChinoException because is not provided any file",
            function () {
                this.slow(750);
                this.timeout(10000);

                return blobCaller.download(blobId, "")
                    .then((res) => {throw new Error("This promise shouldn't be fulfilled!")})
                    .catch((error) => {
                        error.should.be.instanceOf(objects.ChinoException);
                        error.result_code.should.be.equal(400)
                    })
            }
        );
        it("Download file should throw a ChinoException due missing output file",
            function () {
                this.slow(1500);
                this.timeout(12000);

                return blobCaller.upload(docId, "file", "")
                    .then((res) => {throw new Error("This promise shouldn't be fulfilled!")})
                    .catch((error) => {
                        error.should.be.instanceOf(objects.ChinoException);
                        error.result_code.should.be.equal(400)
                    })
            }
        );
        // it("Delete file should throw a ChinoException because as a result of wrong blob id",
        //     function () {
        //       return blobCaller.delete("wrongId")
        //           .then((res) => {throw new Error("This promise shouldn't be fulfilled!")})
        //           .catch((error) => {
        //             error.should.be.instanceOf(objects.ChinoException)
        //             error.result_code.should.be.equal(404)
        //           })
        //     }
        // );
    });

    after("Clean environment", function () {
        // be sure to have enough time
        this.timeout(10000);

        function sleep (time) {
            return new Promise((resolve) => setTimeout(resolve, time));
        }

        return sleep(1000).then(() => {
            if (schemaId !== "") {
                return apiCall.del(`/schemas/${schemaId}?force=true&all_content=true`)
                    .then(res => {
                        if (repoId !== "") {
                            return apiCall.del(`/repositories/${repoId}?force=true`)
                                .then(res => { /*console.log("Removed stub stuff")*/ })
                                .catch(err => { console.log(`Error removing repository resources`) });
                        }
                    })
                    .catch(err => { console.log(`Error removing test resources`) });
            }
        });
    });
});
