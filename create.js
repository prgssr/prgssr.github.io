fs = require ('fs');

fs.readFile('_data/tags.yml', 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
     var taglist = data.trim().split("\n");
     taglist.map(write_file);
  });

function write_file (taglist){
  var tag = taglist.split(":");
  var filename = "tag/" + tag[0] +".html";
  var content = "---\nlayout: tag\nthumbnail: \u0022noimage\u0022\ntitle: " + tag[1]+ "\ndescription: " + tag[1]+ "\n---\n{% assign tag=\u0022" + tag[0] + "\u0022 %}\n{% include utils/tag-page.html %}\n";
  fs.writeFile(filename, content);
}
