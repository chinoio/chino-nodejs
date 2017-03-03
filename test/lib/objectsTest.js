/**
 * Created by daniele on 24/02/17.
 */

const assert = require("assert");
const should = require('should');

const objects = require("./src/objects");

describe("Chino API Objects", function() {
  describe("Group object", function() {
    it("Should return a correct Group object", function() {
      let responseTest = {
        "result": "success",
        "result_code": 200,
        "message": null,
        "data": {
          "group": {
            "groupname": "pysiciansXY",
            "group_id": "77de01d8-492d-4cc2-a2b2-d3e76edc0657",
            "insert_date": "2015-02-07T12:14:46.754",
            "is_active": true,
            "last_update": "2015-02-21T19:07:45.832",
            "attributes": {
              "hospital": "Main Hospital"
            }
          }
        }
      };

      let group = new objects.Group(responseTest);
      group.should.instanceOf(objects.Group);
      group.should.containEql(responseTest.data.group);
    });

    it("Should return an empty Group object", function() {
      let emptyResponse = {}

      let group = new objects.Group(emptyResponse);
      group.should.instanceOf(objects.Group);
      group.should.containEql(emptyResponse);
    });
  });

  describe("User Schema object", function() {
    it("Should return a correct User Schema object", function() {
      let responseTest = {
        "message": null,
        "data": {
          "user_schema": {
            "user_schema_id": "c4021bd4-cf6a-4e81-bf3c-7dcb89fe84fb",
            "description": "Encountersasda",
            "is_active": false,
            "last_update": "2016-02-05T15:47:44.884Z",
            "groups": [],
            "structure": {
              "fields": [
                {
                  "type": "string",
                  "name": "test_string"
                },
                {
                  "type": "string",
                  "name": "test_string1"
                }
              ]
            },
            "insert_date": "2016-02-05T15:31:42.321Z"
          }
        },
        "result": "success",
        "result_code": 200
      };

      let user_schema = new objects.UserSchema(responseTest);
      user_schema.should.instanceOf(objects.UserSchema);
      user_schema.should.containEql(responseTest.data.user_schema);
    });

    it("Should return an empty User Schema object", function() {
      let emptyResponse = {}

      let user_schema = new objects.UserSchema(emptyResponse);
      user_schema.should.instanceOf(objects.UserSchema);
      user_schema.should.containEql(emptyResponse);
    });
  });

  describe("User object", function() {
    it("Should return a correct User object", function() {
      let responseTest = {
        "result": "success",
        "result_code": 200,
        "message": null,
        "data": {
          "user": {
            "username": "james",
            "user_id": "d88084ef-b6f7-405d-9863-d35b99543389",
            "insert_date": "2015-02-05T10:53:38.157",
            "last_update": "2015-02-05T10:53:38.157",
            "is_active": true,
            "attributes": {
              "first_name": "James",
              "last_name": "Ford",
              "email": "james@acme.com"
            },
            "groups": [
              "d88084ef-b6f7-405d-9863-d35b99543389",
              "1eb39c88-3ac8-4664-b897-849dd260c72b"
            ]
          }
        }
      };

      let user = new objects.User(responseTest);
      user.should.instanceOf(objects.User);
      user.should.containEql(responseTest.data.user);
    });

    it("Should return an empty User object", function() {
      let emptyResponse = {}

      let user = new objects.User(emptyResponse);
      user.should.instanceOf(objects.User);
      user.should.containEql(emptyResponse);
    });
  });

  describe("Application object", function() {
    it("Should return a correct Application object", function() {
      let responseTest = {
        "message": null,
        "data": {
          "application": {
            "app_secret": "9qJbeD9Gb0zpdFXuB9oRmW1ETFDWI...lUgY0XXbT7hYk1Jkad",
            "grant_type": "authorization-code",
            "app_name": "Test",
            "redirect_url": "http://127.0.0.1/",
            "app_id": "lMcaHVNwqAuGulPIEj8voH3FQhMKPbj5GzShsxVL"
          }
        },
        "result": "success",
        "result_code": 200
      };

      let application = new objects.Application(responseTest);
      application.should.instanceOf(objects.Application);
      application.should.containEql(responseTest.data.application);
    });

    it("Should return an empty Application object", function() {
      let emptyResponse = {}

      let application = new objects.Application(emptyResponse);
      application.should.instanceOf(objects.Application);
      application.should.containEql(emptyResponse);
    });
  });

  describe("Repository object", function() {
    it("Should return a correct Repository object", function() {
      let responseTest = {
        "result": "success",
        "result_code": 200,
        "message": null,
        "data": {
          "repository": {
            "repository_id": "d88084ef-b6f7-405d-9863-d35b99543389",
            "last_update": "2015-02-24T21:48:16.332",
            "is_active": true,
            "description": "This is a test repo",
            "insert_date": "2015-02-24T21:48:16.332"
          }
        }
      };

      let repository = new objects.Repository(responseTest);
      repository.should.instanceOf(objects.Repository);
      repository.should.containEql(responseTest.data.repository);
    });

    it("Should return an empty Repository object", function() {
      let emptyResponse = {}

      let repository = new objects.Repository(emptyResponse);
      repository.should.instanceOf(objects.Repository);
      repository.should.containEql(emptyResponse);
    });
  });

  describe("Schema object", function() {
    it("Should return a correct Schema object", function() {
      let responseTest = {
        "result": "success",
        "result_code": 200,
        "message": null,
        "data": {
          "schema": {
            "description": "testSchema",
            "schema_id": "b1cc4a53-19a1-4819-a8c7-20bf153ec9cf",
            "repository_id": "3ddba8af-6965-4416-9c5c-acf6af95539d",
            "is_active": true,
            "insert_date": "2015-02-15T16:22:04.058",
            "last_update": "2015-02-15T16:22:04.058",
            "structure": {
              "fields": [
                {
                  "type": "integer",
                  "name": "test_int",
                  "indexed": true
                },
                {
                  "type": "float",
                  "name": "test_float",
                  "indexed": true
                },
                {
                  "type": "time",
                  "name": "test_time"
                }
              ]
            }
          }
        }
      };

      let schema = new objects.Schema(responseTest);
      schema.should.instanceOf(objects.Schema);
      schema.should.containEql(responseTest.data.schema);
    });

    it("Should return an empty Schema object", function() {
      let emptyResponse = {}

      let schema = new objects.Schema(emptyResponse);
      schema.should.instanceOf(objects.Schema);
      schema.should.containEql(emptyResponse);
    });
  });

  describe("Document object", function() {
    it("Should return a correct Document object", function() {
      let responseTest = {
        "result": "success",
        "result_code": 200,
        "message": null,
        "data": {
          "document": {
            "document_id": "c373ba1a-1f23-4e36-a099-0ea3306b093d",
            "repository_id": "3ddba8af-6965-4416-9c5c-acf6af95539d",
            "schema_id": "130b875a-d291-453e-8559-1b3c54500432",
            "insert_date": "2015-02-24T22:27:35.919",
            "is_active": true,
            "last_update": "2015-02-24T22:27:35.919",
            "content": {
              "physician_id": "130b875a-d291-453e-8559-1b3c54500432",
              "physician_name": "Jack",
              "observation": "The patient was ok.",
              "visit_date": "2015-02-19 16:39:47"
            }
          }
        }
      };

      let document = new objects.Document(responseTest);
      document.should.instanceOf(objects.Document);
      document.should.containEql(responseTest.data.document);
    });

    it("Should return an empty Document object", function() {
      let emptyResponse = {}

      let document = new objects.Document(emptyResponse);
      document.should.instanceOf(objects.Document);
      document.should.containEql(emptyResponse);
    });
  });

  describe("Collection object", function() {
    it("Should return a correct Collection object", function() {
      let responseTest = {
        "message": null,
        "data": {
          "collection": {
            "collection_id": "de991a83-da39-4a72-a79e-1376124ebd57",
            "last_update": "2016-02-08T11:05:26.571Z",
            "is_active": true,
            "name": "testCollection",
            "insert_date": "2016-02-08T11:05:26.571Z"
          }
        },
        "result": "success",
        "result_code": 200
      };

      let collection = new objects.Collection(responseTest);
      collection.should.instanceOf(objects.Collection);
      collection.should.containEql(responseTest.data.collection);
    });

    it("Should return an empty Collection object", function() {
      let emptyResponse = {}

      let collection = new objects.Collection(emptyResponse);
      collection.should.instanceOf(objects.Collection);
      collection.should.containEql(emptyResponse);
    });
  });
});