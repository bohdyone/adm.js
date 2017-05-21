adm.define('needsDom', ['dom'],
function(dom) {
  console.log("Got the dom!");

  var p = dom.createElement("p");
  p.innerText = "It works!";
  dom.body.appendChild(p);
});
