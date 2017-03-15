/*                           *\
 * Clean up Chino customer   *
 * environment after testing *
\*                           */

const fs = require("fs");
const path = require("path");

const Call = require("../src/apiCall.js")
const settings = require("./testsSettings")

const baseUrl     = settings.baseUrl;
const customerId  = settings.customerId;
const customerKey = settings.customerKey;

const apiCall = new Call(baseUrl, customerId, customerKey);

console.log("\nCleaning up Chino customer environment...");
// Remove every objects from Chino customer space
Promise.all([
  apiCall.get(`/repositories`)
    .then(result =>
      Promise.all(
          result.data.repositories.map(
              repo =>
                 apiCall.get(`/repositories/${repo.repository_id}/schemas`)
                    .then( res =>
                        Promise.all(res.data.schemas.map(
                            schema => apiCall.del(`/schemas/${schema.schema_id}?force=true&all_content=true`)
                            )
                        ).then(res => apiCall.del(`/repositories/${repo.repository_id}?force=true`))
                    )
          )
      )
    ),

  apiCall.get(`/user_schemas`)
    .then(result =>
      Promise.all(
          result.data.user_schemas.map(
              us => apiCall.del(`/user_schemas/${us.user_schema_id}?force=true`)
          )
      )
    ),

  apiCall.get(`/collections`)
    .then(result =>
      Promise.all(
          result.data.collections.map(
              c => apiCall.del(`/collections/${c.collection_id}?force=true`)
          )
      )
    ),

  apiCall.get(`/groups`)
    .then(result =>
      Promise.all(
          result.data.groups.map(
              g => apiCall.del(`/groups/${g.group_id}?force=true`)
          )
      )
    ),

  apiCall.get(`/auth/applications`)
    .then(result =>
      Promise.all(
          result.data.applications.map(
              app => apiCall.del(`/auth/applications/${app.app_id}`)
          )
      )
    )
])
.then((/*result*/) => {
  // delete file previously created
  try {
    fs.unlinkSync(path.join(__dirname, "lib/", settings.filedata));
    fs.unlinkSync(path.join(__dirname, "lib/files/result.jpg"));
  }
  catch (error) {
    if (error.code !== "ENOENT") console.log(error);
  }

  // notify the end of the process
  console.log("Done.\n");
}).catch(error => { console.log(error); });
