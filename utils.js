const logColors = {
    green : "32",
    red: "31",
    yellow: "33",
    blue: "36",
    magenta: "35"
}
// module used to log a msg in color /!\ only one param : just a string msg is passed to console.log /!\
module.exports.log = (msg, color) => console.log(`\x1b[${logColors[color||"red"]}m%s\x1b[0m`, msg)  //cyan
 