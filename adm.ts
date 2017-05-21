namespace adm {
    var moduleDependencies = {};
    var moduleDefinitions = {};
    var moduleInstances = {};

    export function define(modName: string, reqs: string[], def) {
        if (moduleDependencies.hasOwnProperty(modName)) {
            throw `Multiple definition of module '${modName}'.`;
        }

        moduleDependencies[modName] = reqs || [];
        moduleDefinitions[modName] = def || {};

        let shouldContinue = true;
        while (shouldContinue) {
            shouldContinue = false;
            for (let u in moduleDependencies) {
                let resolved = resolve(u);
                shouldContinue = shouldContinue || resolved;
            }
        }
    }

    export function getUnresolved(): string[] {
        return Object.keys(moduleDefinitions).filter(u => !moduleInstances.hasOwnProperty(u));
    }

    function getInstance(modName: string) {
        if (moduleInstances.hasOwnProperty(modName))
            return moduleInstances[modName];

        throw `Module '${modName}' could not be resolved.`;
    }

    function resolve(modName): boolean {
        if (moduleInstances.hasOwnProperty(modName))
            return false;

        let exportsObj = null;
        let deps = [];
        for (let dep of moduleDependencies[modName]) {
            if (dep == 'require') {
                deps.push(getInstance);
            }
            else if (dep == 'exports') {
                exportsObj = {};
                deps.push(exportsObj);
            }
            else {
                // not all deps resolved yet
                if (!moduleInstances.hasOwnProperty(dep)) {
                    return false;
                }
                deps.push(moduleInstances[dep]);
            }
        }

        let inst = null;
        if (typeof moduleDefinitions[modName] == 'object') {
            inst = moduleDefinitions[modName];
        }
        else {
            try {
              let ret = moduleDefinitions[modName](...deps);
              inst = exportsObj || ret;
            }
            catch(ex)
            {
              console.log(`Error resolving module '${modName}': ${ex}`);
              return false;
            }
        }

        moduleInstances[modName] = inst;
        return true;
    }
}

// Uncomment for compatability with existing AMD modules
/*
var define: any = function(modName: string, requirements: string[], constructor) {
    adm.define(modName, requirements, constructor);
};

define.amd = true;
*/
