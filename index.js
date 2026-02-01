const args = process.argv.slice(2);
const child_proccess = require("child_process")
const fs = require('fs');
const vm = require('vm');
const chalk = require("chalk");
    const version = "0.7.9"

    if (args.includes("-V")) {
        console.log("NattyScript",version)
        process.exit()
    }

    if (!args[0]) {
        console.log(`NattyScript Help
Usage : nat <Input File> <Options> or nat <Options>
Options : 
--run : Run the code after its compiled
-V : Show the version`)
        process.exit() 
    }
    let compiledFile = "dist/"+args[0]
    if (!compiledFile.endsWith(".js")) {
        compiledFile += ".js"
    }
    const fileContent = fs.readFileSync(
        "./"+args[0],{
            encoding:"utf8"
        },
        "r"
    )

    console.log("Using",version)

    if (!fs.existsSync("./dist/E")) {
        fs.mkdirSync("dist",{

        })
        fs.writeFileSync("./dist/E","EEEEE")
    }

    if (!fs.existsSync("./libs/E")) {
        fs.mkdirSync("libs",{

        })
        fs.writeFileSync("./libs/E","EEEEE")
    }

    fs.writeFileSync(compiledFile,"// NattyScript compiled file\n// Compiled from : "+args[0]+"\n// Natty Script Version : "+version)

    const lines = fileContent.split("\n")

    let op = []

    lines.forEach(function(value){
        op.push(value.trimStart().split(" ")[0])
    })

    if (op.includes("ask")) {

    fs.appendFileSync(compiledFile,`
const { execSync } = require('child_process');

function tryRequire(moduleName) {
  try {
    return require(moduleName);
  } catch (e) {
    return null;
  }
}

let prompt = tryRequire('prompt-sync');

if (!prompt) {
  execSync('npm install prompt-sync', { stdio: 'inherit' });
  prompt = tryRequire('prompt-sync');
}`)
    }
    if (op.includes("readfile")||op.includes("writefile")||op.includes("removefile")) {
        fs.appendFileSync(compiledFile, "\nconst fs = require('fs');")
    }
    if (op.includes("wait")) {
        fs.appendFileSync(compiledFile, "\nconst delay = ms => new Promise(r => setTimeout(r, ms));")
    }

    let tab = 0
    
    if (!op.includes("_iife")) {
        fs.appendFileSync(compiledFile,"\n(async () => {")
        tab = 1
    }

    let lineNum = 0
    fs.appendFileSync(compiledFile,"\n"+("\t").repeat(tab)+"let output;")
    let imports = []
    let errors = []
    lines.forEach(function(RLline){
        lineNum++
        let line = RLline.trimStart()
        const commandArgs = line.split(" ")
        let commandHandler = {
            print: () => {
                if (commandArgs[1]) {
                    fs.appendFileSync(compiledFile,"\n"+("\t").repeat(tab)+"console.log(`"+commandArgs.slice(1).join(" ").replace(/\$(.+?)\$/g, '${$1}')+"`);")
                } else {
                    fs.appendFileSync(compiledFile,"\n"+("\t").repeat(tab)+"// Error processing the line "+lineNum)
                    errors.push(`Argument 1 missing in line ${lineNum}`)
                }
            },
            exit: () => {
                fs.appendFileSync(compiledFile,"\n"+("\t").repeat(tab)+"process.exit();")
            },
            clear: () => {
                fs.appendFileSync(compiledFile,"\n"+("\t").repeat(tab)+"console.clear();")
            },
            wait: () => {
                if (commandArgs[1]) {
                    fs.appendFileSync(compiledFile,`\n${("\t").repeat(tab)}await delay(${commandArgs[1].replace(/\$(.+?)\$/g, '${$1}')*1000});`)
                } else {
                    fs.appendFileSync(compiledFile,"\n"+("\t").repeat(tab)+"// Error processing the line "+lineNum)
                    errors.push(`Argument 1 missing in line ${lineNum}`)
                }
            },
            let: () => {
                if (commandArgs.length>2) {
                    let prefix = "`"
                    let suffix = "`"
                    switch (commandArgs[1]) {
                    case "object":
                        prefix = "{"
                        suffix = "}"
                        break;
                    case "array":
                        prefix = "["
                        suffix = "]"
                        break;
                    case "number":
                        prefix = ""
                        suffix = ""
                        break;
                    }
                    fs.appendFileSync(compiledFile,"\n"+("\t").repeat(tab)+"let "+commandArgs[2]+" = "+prefix+commandArgs.slice(3).join(" ").replace(/\$(.+?)\$/g, '${$1}')+suffix+";");
                } else {
                    fs.appendFileSync(compiledFile,"\n"+("\t").repeat(tab)+"// Error processing the line "+lineNum)
                    errors.push(`Argument 1 or 2 missing in line ${lineNum}`)
                }
            },
            loop: () => {
                if (commandArgs[1]) {
                    fs.appendFileSync(compiledFile,"\n"+("\t").repeat(tab)+"for (let i = 0; i < "+commandArgs[1]+"; i++) {")
                    tab++
                } else {
                    fs.appendFileSync(compiledFile,"\n"+("\t").repeat(tab)+"// Error processing the line "+lineNum)
                    errors.push(`Argument 1 missing in line ${lineNum}`)
                }
            },
            if: () => {
                if (commandArgs.slice(1).join(" ").replace(/\$(.+?)\$/g, '${$1}')) {
                    fs.appendFileSync(compiledFile,"\n"+("\t").repeat(tab)+"if ("+commandArgs.slice(1).join(" ")+") {")
                    tab++
                } else {
                    fs.appendFileSync(compiledFile,"\n"+("\t").repeat(tab)+"// Error processing the line "+lineNum)
                    errors.push(`Argument 1 missing in line ${lineNum}`)
                }
            },
            else_if: () => {
                if (commandArgs.slice(1).join(" ").replace(/\$(.+?)\$/g, '${$1}')) {
                    tab--
                    fs.appendFileSync(compiledFile,"\n"+("\t").repeat(tab)+"} else if ("+commandArgs.slice(1).join(" ")+") {")
                    tab++
                } else {
                    fs.appendFileSync(compiledFile,"\n"+("\t").repeat(tab)+"// Error processing the line "+lineNum)
                    errors.push(`Argument 1 missing in line ${lineNum}`)
                }
            },
            else: () => {
                tab--
                fs.appendFileSync(compiledFile,"\n"+("\t").repeat(tab)+"} else {")
                tab++
            },
            end: () => {
                tab--
                fs.appendFileSync(compiledFile,"\n"+("\t").repeat(tab)+"};")
            },
            ask: () => {
                if (commandArgs[1]) {
                    fs.appendFileSync(compiledFile,"\n"+("\t").repeat(tab)+"output = prompt()(`"+(""||commandArgs.slice(1).join(" ")).replace(/\$(.+?)\$/g, '${$1}')+"`);")
                } else {
                    fs.appendFileSync(compiledFile,"\n"+("\t").repeat(tab)+"// Error processing the line "+lineNum)
                    errors.push(`Argument 1 missing in line ${lineNum}`)
                }
            },
            forever: () => {
                fs.appendFileSync(compiledFile,"\n"+("\t").repeat(tab)+"while (true) {")
                tab++
            },
            func: () => {
                if (commandArgs[1]&&commandArgs[2]) {
                    fs.appendFileSync(compiledFile,"\n"+("\t").repeat(tab)+"function "+commandArgs[1]+"("+commandArgs.slice(2).join(",")+"){")
                    tab++
                } else {
                    fs.appendFileSync(compiledFile,"\n"+("\t").repeat(tab)+"// Error processing the line "+lineNum)
                    errors.push(`Argument 1 or 2 missing in line ${lineNum}`)
                }
            },
            call: () => {
                if (commandArgs[1]) {
                    let funcArg = commandArgs.slice(2).join(" ")
                    fs.appendFileSync(compiledFile,"\n"+("\t").repeat(tab)+commandArgs[1]+"("+funcArg+")")
                } else {
                    fs.appendFileSync(compiledFile,"\n"+("\t").repeat(tab)+"// Error processing the line "+lineNum)
                    errors.push(`Argument 1 missing in line ${lineNum}`)
                }
            },
            "=": () => {
                if (commandArgs[1]&&commandArgs.slice(2).join(" ").replace(/\$(.+?)\$/g, '${$1}')) {
                    fs.appendFileSync(compiledFile,"\n"+("\t").repeat(tab)+commandArgs[1]+" = `"+commandArgs.slice(2).join(" ").replace(/\$(.+?)\$/g, '${$1}')+"`")
                } else {
                    fs.appendFileSync(compiledFile,"\n"+("\t").repeat(tab)+"// Error processing the line "+lineNum)
                    errors.push(`Argument 1 missing in line ${lineNum}`)
                }
            },
            "//": () => {

            },
            "custom": () => {
                if (commandArgs[1]) {
                    fs.appendFileSync(compiledFile,"\n"+("\t").repeat(tab)+commandArgs.slice(1).join(" ").replace(/\$(.+?)\$/g, '${$1}'))
                } else {
                    fs.appendFileSync(compiledFile,"\n"+("\t").repeat(tab)+"// Error processing the line "+lineNum)
                    errors.push(`Argument 1 missing in line ${lineNum}`)
                }
            },
            "readfile": () => {
                if (commandArgs[1]) {
                    fs.appendFileSync(compiledFile,"\n"+("\t").repeat(tab)+"if (fs.existsSync(`"+commandArgs.slice(1).join(" ").replace(/\$(.+?)\$/g, '${$1}')+"`)) {")
                    tab += 1
                    fs.appendFileSync(compiledFile,"\n"+("\t").repeat(tab)+"output = fs.readFileSync(`"+commandArgs.slice(1).join(" ").replace(/\$(.+?)\$/g, '${$1}')+"`, 'utf8');")
                    tab -= 1
                    fs.appendFileSync(compiledFile,"\n"+("\t").repeat(tab)+"} else {")
                    tab += 1
                    fs.appendFileSync(compiledFile,"\n"+("\t").repeat(tab)+"output = `$output`;")
                    tab -= 1
                    fs.appendFileSync(compiledFile,"\n"+("\t").repeat(tab)+"}")
                } else {
                    fs.appendFileSync(compiledFile,"\n"+("\t").repeat(tab)+"// Error processing the line "+lineNum)
                    errors.push(`Argument 1 missing in line ${lineNum}`)
                }
            },
            "_iife": () => {
                let tabi = (tab-1)
                if (tabi==-1) {
                    tabi = 0
                }
                fs.appendFileSync(compiledFile,"\n"+("\t").repeat(tabi)+"(async () => {")
                tab++
            },
            "writefile": () => {
                if (commandArgs[1]) {
                    fs.appendFileSync(compiledFile,"\n"+("\t").repeat(tab)+"fs.writeFileSync(`"+commandArgs[1].replace(/\$(.+?)\$/g, '${$1}')+"`,`"+commandArgs.slice(2).join(" ").replace(/\$(.+?)\$/g, '${$1}')+"`);")
                } else {
                    fs.appendFileSync(compiledFile,"\n"+("\t").repeat(tab)+"// Error processing the line "+lineNum)
                    errors.push(`Argument 1 missing in line ${lineNum}`)
                }
            },
            "import": () => {
                if (!fs.existsSync("./libs/"+commandArgs.slice(1).join(" ")+".js")) {
                    fs.appendFileSync(compiledFile,"\n"+("\t").repeat(tab)+"// Error processing the line "+lineNum)
                    errors.push(`Argument 1 missing in line ${lineNum}`)
                }
                imports.push(commandArgs.slice(1).join(" "))
            },
            "": () => {

            },
        }
        if (!commandHandler[commandArgs[0]]) {
            for (const libFile of imports) {
                const code = fs.readFileSync(`./libs/${libFile}.js`,"utf8")
                let module = { exports: {} };
                const script = new vm.Script(code);
                const context = vm.createContext({ module, exports: module.exports, require });
                script.runInContext(context);
                lib = module.exports
                if (lib.commands) {
                if (lib.commands[commandArgs[0]]) {
                    fs.appendFileSync(compiledFile,"\n"+("\t").repeat(tab)+lib.commands[commandArgs[0]](commandArgs))
                    return
                }
                }
            }
            fs.appendFileSync(compiledFile,"\n"+("\t").repeat(tab)+"// Error processing the line "+lineNum)
            errors.push(`Line ${line} contain a not found keyword`)
            
            return;
        }
        commandHandler[commandArgs[0]]();
    })
    fs.appendFileSync(compiledFile,"\n})();")
    if (errors.length==0) {
        console.log(chalk.green("Done with 0 error"))
    } else {
        console.log(chalk.red(`Done with ${errors.length} error`))
        errors.forEach((value,index)=>{
            console.log(chalk.red(`${index+1}. ${value}`))
        })
    }
    if (args.includes("--run")) {
        console.clear()
        let child = child_proccess.spawn('node', [compiledFile], {
            stdio: 'inherit',
        });

        child.on('close', (code) => {
            process.exit(code);

        });
    }