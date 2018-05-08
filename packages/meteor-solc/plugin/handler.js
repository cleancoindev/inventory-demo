const fs = Npm.require('fs');
const path = Npm.require('path');
const solc = Npm.require('solc');


class SolidityCompiler {
  findImports(p) {
    const fullPath = path.join('node_modules', p);
    if (!fs.existsSync(fullPath)) {
      return { error: 'File not found' }
    }
    const contents = {
      contents: fs.readFileSync(fullPath, "utf8")
    };

    return contents;
  }

  // WIP
  // Refer to
  // https://solidity.readthedocs.io/en/develop/using-the-compiler.html#compiler-input-and-output-json-description
  // https://docs.meteor.com/api/packagejs.html#build-plugin-compilers
  processFilesForTarget(files) {
    files.forEach((file) => {
      if (/node_modules\/.+sol/.test(file.getPathInPackage())) {
        return
      }
      const input = {
        language: "Solidity",
        sources: {
          "file": {
            content: file.getContentsAsString(),
          },
        },
        settings: {
          outputSelection: {
            // Enable the metadata and bytecode outputs of every single contract.
            "*": {
              "*": [
                "abi", "evm.bytecode.object",
              ]
            },
          },
        },
      }

      const output = solc.compileStandardWrapper(
        JSON.stringify(input),
        this.findImports,
      );
      console.log(JSON.parse(output));

      file.addJavaScript({
        data: output,
        path: `${file.getPathInPackage()}.js`
      });
    });
  }
}

Plugin.registerCompiler({
  extensions: ['sol'],
}, () => new SolidityCompiler);
