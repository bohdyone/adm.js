var adm;
(function (adm) {
    var moduleDependencies = {};
    var moduleDefinitions = {};
    var moduleInstances = {};
    function define(modName, reqs, def) {
        if (moduleDependencies.hasOwnProperty(modName)) {
            throw "Multiple definition of module '" + modName + "'.";
        }
        moduleDependencies[modName] = reqs || [];
        moduleDefinitions[modName] = def || {};
        var shouldContinue = true;
        while (shouldContinue) {
            shouldContinue = false;
            for (var u in moduleDependencies) {
                var resolved = resolve(u);
                shouldContinue = shouldContinue || resolved;
            }
        }
    }
    adm.define = define;
    function getUnresolved() {
        return Object.keys(moduleDefinitions).filter(function (u) { return !moduleInstances.hasOwnProperty(u); });
    }
    adm.getUnresolved = getUnresolved;
    function getInstance(modName) {
        if (moduleInstances.hasOwnProperty(modName))
            return moduleInstances[modName];
        throw "Module '" + modName + "' could not be resolved.";
    }
    function resolve(modName) {
        if (moduleInstances.hasOwnProperty(modName))
            return false;
        var exportsObj = null;
        var deps = [];
        for (var _i = 0, _a = moduleDependencies[modName]; _i < _a.length; _i++) {
            var dep = _a[_i];
            if (dep == 'require') {
                deps.push(getInstance);
            }
            else if (dep == 'exports') {
                exportsObj = {};
                deps.push(exportsObj);
            }
            else {
                if (!moduleInstances.hasOwnProperty(dep)) {
                    return false;
                }
                deps.push(moduleInstances[dep]);
            }
        }
        var inst = null;
        if (typeof moduleDefinitions[modName] == 'object') {
            inst = moduleDefinitions[modName];
        }
        else {
            try {
                var ret = moduleDefinitions[modName].apply(moduleDefinitions, deps);
                inst = exportsObj || ret;
            }
            catch (ex) {
                console.log("Error resolving module '" + modName + "': " + ex);
                return false;
            }
        }
        moduleInstances[modName] = inst;
        return true;
    }
})(adm || (adm = {}));
var define = function (modName, requirements, constructor) {
    adm.define(modName, requirements, constructor);
};
define.amd = true;
