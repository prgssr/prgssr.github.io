// require:

var replace = require("replace");

// use:

replace({
    regex: "http://media.mediatemple.netdna-cdn.com/wp-content/uploads",
    replacement: "https://www.smashingmagazine.com/wp-content/uploads",
    paths: ['_posts'],
    recursive: true,
    silent: true,
});