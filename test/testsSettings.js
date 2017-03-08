const path = require("path");
const jsonfile = require("jsonfile");

module.exports.baseUrl = "https://api.dev.chino.io/v1";
module.exports.customerId  = process.env.CHINO_ID;  // insert here your Chino Customer ID
module.exports.customerKey = process.env.CHINO_KEY; // insert here your Chino Customer KEY
module.exports.filedata = "data.json";

module.exports.data = function () {
  try {
    return jsonfile.readFileSync(path.join(__dirname, "lib/", this.filedata));
  }
  catch (error) {
    throw new Error(`Data file impossible to read:\n${error}`);
  }
}
