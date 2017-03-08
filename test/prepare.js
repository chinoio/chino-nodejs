/**
 * Created by daniele on 08/03/17.
 */


const prepare = require('mocha-prepare');

let repoId = "";
let schemaId = "";
let docIds = [];
let collId = "";

let usrSchemaId = "";
let usrIds = [];
let groupId = "";

let appId = "";
let appSecret = "";

let apiCall;

module.exports = function (caller) {
  apiCall = caller;

  prepare(function (done) {
    environmentSetUp(done);
    return {
      repoId : repoId,
      schemaId : schemaId,
      docsId : docsId,
      collId : collId,
      usrSchemaIdId : usrSchemaIdId,
      usrIds : usrIds,
      groupId : groupId,
      appId : appId,
      appSecret : appSecret
    }
  }, function (done) {
    // called after all test completes (regardless of errors)
    environmentCleanUp(done);
  });
}

// Support function: wait time milliseconds before resolve Promise
function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function environmentSetUp(done) {
  console.log("    Set up resources to test the lib...")
  // create an array of 7 element from 1 to 7
  const ids = Array.from(new Array(elements), (val,index) => index+1);

  // define resources data (Repository, Schema, Document, ...)
  const repo = {
    description : "Repository for testing Search lib",
  };

  const schema = {
    description: "Schema for testing Search lib",
    structure: {
      fields: [
        {
          name: "info",
          type: "string",
        },
        {
          name: "num",
          type: "integer",
          indexed: true
        },
      ]
    }
  };

  // return a doc Js representation
  let doc = (id) => ({
    content: {
      info : `document test ${Date.now()}`,
      num : id
    }
  });

  /* create user schema and insert N user */
  const userSchema = {
    description : "User Schema for testing Search lib",
    structure : {
      fields : [
        {
          type : "integer",
          name : "user",
          indexed: true
        }
      ]
    }
  };
  let user = (id) => ({
    username: `aUser${id}+${Date.now()}`,
    password: `aPassword+${id}`,
    attributes: {
      user: id
    },
    is_active: true
  });

  // create a group and later insert 2 user inside
  const group = {
    group_name : `groupTest+${Date.now()}`,
    attributes : {
      container : "default"
    }
  };
  // add a collection and later insert 2 documents inside
  const collection = {
    name : `collectionTest+${Date.now()}`
  }
  // add an application
  const application = {
    name : `applicationTest+${Date.now()}`,
    grant_type : "password"
  }

  // wait to resolve 3 promises
  return Promise.all([
    Promise.all([
      /* create users resources */
      apiCall.post("/user_schemas", userSchema)
          .then((res) => {
            usrSchemaId = res.data.user_schema.user_schema_id;

            return Promise.all(ids.map(id =>
                apiCall.post(`/user_schemas/${usrSchemaId}/users`, user(id)))
            )
                .then((res) => {
                  res.forEach(r => { usrIds.push(r.data.user.user_id); });
                })
          }),
      /* create a group */
      apiCall.post("/groups", group)
          .then(res => { groupId = res.data.group.group_id; })
    ])
        .then(res =>
            /* add users to group */
            Promise.all([usrIds[0], usrIds[1]]
                .map(id => apiCall.post(`/groups/${groupId}/users/${id}`))
            )
        )
        .catch((err) => console.log(`Error inserting users resources\n${JSON.stringify(err)}`)),
    /* create documents resources */
    Promise.all([
      apiCall.post("/repositories", repo)
          .then((res) => {
            repoId = res.data.repository.repository_id;

            return apiCall.post(`/repositories/${repoId}/schemas`, schema)
                .then((res) => {
                  schemaId = res.data.schema.schema_id;

                  return Promise.all(ids.map(id =>
                      apiCall.post(`/schemas/${schemaId}/documents`, doc(id))))
                      .then((res) => {
                        res.forEach(r => { docIds.push(r.data.document.document_id); });
                      })
                })
          }),
      /* create a collection */
      apiCall.post(`/collections`, collection)
          .then(res => { collId = res.data.collection.collection_id; })
    ])
        .then((res =>
                /* add 3 documents to collection */
                Promise.all([docIds[0], docIds[1], docIds[2]]
                    .map(id => apiCall.post(`/collections/${collId}/documents/${id}`))
                )
        ))
        .catch((err) =>
            console.log(`Error inserting documents resources\n${JSON.stringify(err)}`)
        ),
    /* create an application with password auth */
    apiCall.post("/auth/applications", application)
        .then(res => {
          appId = res.data.application.app_id;
          appSecret = res.data.application.app_secret;
        })
        .catch((err) => console.log(`Error creating app\n${JSON.stringify(err)}`))
  ])
  /* need to wait, so server is able to apply all changes */
      .then(() => sleep(2000).then(() => {
        console.log("    Done.\n");
        // notify that environment is ready
        done();
      }));
}

function environmentCleanUp(done) {
  console.log("\n    Cleaning up the environment...")
  // wait before clean up, so we're sure all
  // previous operations are completed
  return sleep(1000).then(() =>
      Promise.all([
        /* delete documents resources */
        apiCall.del(`/schemas/${schemaId}?force=true&all_content=true`)
            .then(res => apiCall.del(`/repositories/${repoId}?force=true`)),
        /* delete users resources */
        apiCall.del(`/user_schemas/${usrSchemaId}?force=true`),
        apiCall.del(`/collections/${collId}?force=true`),
        apiCall.del(`/groups/${groupId}?force=true`),
        apiCall.del(`/auth/applications/${appId}`)
      ])
          .then(() => {
            console.log("    Done.\n")
            done();
          })
          .catch(err => {
            console.log(`Error removing test resources`)
            done();
          })
  );
}