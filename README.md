# adm.js - Asynchronous Dependency Manager #

## What is it?

adm.js is simple ~1KB JavaScript library that let's you define bits of code (i.e. modules) which are executed when their requirements are resolved, and then can in turn satisfy other dependents.

It's written in TypeScript for convenience and readability.

## I want to see some code!

Of course.

```javascript
define('myModule', ['yourModule'],
  function(yourModule) {
    console.log("Now me!");
    console.log("Thanks for " + yourModule)
  });

define('yourModule', [],
  function() {
    console.log("Me first!");
    return "nothing.";
  })

```

## Why not just use RequireJS?

adm.js is in design very similar to RequireJS, except it eschews the dynamic loading of modules, and in fact says nothing about how your modules come to be executed.

Actually, if you want to bootstrap your javascript as soon as possible, there are other problems with the way RequireJS loads your js. See: [script-injected-async-scripts-considered-harmful](https://www.igvita.com/2014/05/20/script-injected-async-scripts-considered-harmful/)

It does, however, work very nicely with the `<script async>` tag supported by most browsers, and solves the problem of reordering the execution of your scripts based on their dependency tree.

Furthermore, there are other uses for adm.js than just loading scripts. Almost anything can be defined and treated as a requirement for something else. See `samples/domReady` for an example.

## Why not just use webpack?

Module packers are great, but they tend to spit out one big 'bundle' of javascript at the end. What if you just need to change a small part of your application? Or update just one third-party library? Your users have to pull down that big 'ol bundle again.

With the age of HTTP/2 coming upon us, it's now more efficient to break up your code into multiple files that are loaded in parallel via `<script async>`.

See `samples/jQuery` for an example of loading a third-party library in an efficient way.

## Is this compatible with existing module systems?

Somewhat. I've made efforts to be compatible with AMD module syntax as long as these modules are defined with an id as the first parameter. This is optional in RequireJS, but now necessary due to the way adm.js is designed.

See `samples/jQuery` for loading an existing compatible AMD module.
See `samples/requireExports` for an example of using "exports" and "require" (though the latter is discouraged).

Note that no relative path resolution happens, simply string names are matched to string requirements.
Note also that TypeScript's AMD module compiler (annoyingly) doesn't work out of the box because the modules aren't defined with ids.

## Does this work with circular dependencies?

Simplicity is the ultimate sophistication. So no ;)

## Feedback

Is welcome!
