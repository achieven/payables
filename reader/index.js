const fs = require("fs");
const path = require('path');


exports.initPayables = function () {
    const jsonFile = fs.readFileSync(path.join(__dirname, '../assets/payables_json.txt'))
    const payables = JSON.parse(jsonFile);
    return payables;
};

