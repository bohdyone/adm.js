define("jqTest", ["jquery"],
function(jq) {
  console.log("jqTest!");
  var title = jq(document).find("title").text();
  var message = "The title is: " + title;
  window.alert(message);
});
