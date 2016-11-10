// require:

var replace = require("replace");

// use:

replace({
    regex: "https://media-mediatemple.netdna-ssl.com/wp-content/uploads",
    replacement: "https://www.smashingmagazine.com/wp-content/uploads",
    paths: ['_posts'],
    recursive: true,
    silent: true,
});