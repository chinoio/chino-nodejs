const path = require("path");
const jsonfile = require("jsonfile");

module.exports.baseUrl = process.env.url;
module.exports.customerId  = process.env.customer_id;  // insert here your Chino Customer ID
module.exports.customerKey = process.env.customer_key; // insert here your Chino Customer KEY
module.exports.filedata = "data.json";

module.exports.data = function () {
    try {
        return jsonfile.readFileSync(path.join(__dirname, "lib/", this.filedata));
    }
    catch (error) {
        throw new Error(`Data file impossible to read:\n${error}`);
    }
};

// log unhandled Promise rejection
process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at:', reason.stack || reason)
})
