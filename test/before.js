/*                         *\
 * Set up Chino customer   *
 * environment for testing *
\*                         */

const path = require("path");
const jsonfile = require("jsonfile");

const Call = require("../src/apiCall.js");
const settings = require("./testsSettings");

const baseUrl     = settings.baseUrl;
const customerId  = settings.customerId;
const customerKey = settings.customerKey;

const apiCall = new Call(baseUrl, customerId, customerKey);

// Support function: wait some time before resolve Promise
function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

// Define data to be saved for testing
let data = {
  repoId : "",
  schemaId : "",
  docIds : [],
  collId : "",
  usrSchemaId : "",
  usrIds : [],
  groupId : "",
  appId : "",
  appKey : "",
  elements : 8
}

console.log("Create resources for testing libs...")

// create an array of elements-1 (one will be created manually later)
// from 1 to elements
const ids = Array.from(new Array(data.elements-1), (val,index) => index+1);

// DEFINE RESOURCES
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

// return a doc JS representation
let doc = (id) => ({
  content: {
    info : `document test ${Date.now()}`,
    num : id
  }
});

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

// return a user JS representation
let user = (id) => ({
  username: `aUser${id}+${Date.now()}`,
  password: `aPassword+${id}`,
  attributes: {
    user: id
  },
  is_active: true
});
const fixedUser = {
  username: `theLoginUser`,
  password: `This1CouldBe_a_StrongPassword!`,
  attributes: {
    user: data.elements + 1
  },
  is_active: true
}

const application = {
  name : `applicationTest+${Date.now()}`,
  grant_type : "password"
}

const group = {
  group_name : `groupTest+${Date.now()}`,
  attributes : {
    container : "default"
  }
};

const collection = {
  name : `collectionTest+${Date.now()}`
}

// Start 3 parallel async functions that
// insert resources inside Chino customer environment
module.exports = Promise.all([
  Promise.all([
    /* create users resources */
    apiCall.post("/user_schemas", userSchema)
        .then((res) => {
          data.usrSchemaId = res.data.user_schema.user_schema_id;

          return Promise.all(ids.map(id =>
              apiCall.post(`/user_schemas/${data.usrSchemaId}/users`, user(id)))
          )
          .then((res) => {
            res.forEach(r => { data.usrIds.push(r.data.user.user_id); });
            return apiCall.post(`/user_schemas/${data.usrSchemaId}/users`, fixedUser)
                .then((res) => data.usrIds.push(res.data.user.user_id))
          })
        }),
    /* create a group */
    apiCall.post("/groups", group)
        .then(res => { data.groupId = res.data.group.group_id; })
  ])
  .then(res =>
      /* add users to group */
      Promise.all([data.usrIds[0], data.usrIds[1]]
          .map(id => apiCall.post(`/groups/${data.groupId}/users/${id}`))
      )
  )
  .catch((err) => console.log(`Error inserting users resources\n${JSON.stringify(err)}`)),
  /* create documents resources */
  Promise.all([
    apiCall.post("/repositories", repo)
        .then((res) => {
          data.repoId = res.data.repository.repository_id;

          return apiCall.post(`/repositories/${data.repoId}/schemas`, schema)
              .then((res) => {
                data.schemaId = res.data.schema.schema_id;

                return Promise.all(ids.map(id =>
                    apiCall.post(`/schemas/${data.schemaId}/documents`, doc(id))))
                    .then((res) => {
                      res.forEach(r => { data.docIds.push(r.data.document.document_id); });
                    })
              })
        }),
    /* create a collection */
    apiCall.post(`/collections`, collection)
        .then(res => { data.collId = res.data.collection.collection_id; })
  ])
      .then((res =>
              /* add 3 documents to collection */
              Promise.all([data.docIds[0], data.docIds[1], data.docIds[2]]
                  .map(id => apiCall.post(`/collections/${data.collId}/documents/${id}`))
              )
      ))
      .catch((err) =>
          console.log(`Error inserting documents resources\n${JSON.stringify(err)}`)
      ),
  /* create an application with password auth */
  apiCall.post("/auth/applications", application)
      .then(res => {
        data.appId = res.data.application.app_id;
        data.appKey = res.data.application.app_secret;
      })
      .catch((err) => console.log(`Error creating app\n${JSON.stringify(err)}`))
])
/* need to wait, so server is able to apply all changes */
.then(() => sleep(2000).then(() => {
  // write retrieved data on json file
  jsonfile.writeFileSync(path.join(__dirname, "lib/", settings.filedata), data);
  console.log("Done.");
}));
