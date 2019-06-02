
'use strict';

const fs = require('fs');
const path = require('path');

const FIconfig = {
    basePath: `${path.resolve('../')}\\`
};

function requireUncached(module){
    delete require.cache[require.resolve(module)]
    return require(module)
}

const createFile = async (output, config) => {
    const content = await fileInjector(config);
    await writeFile(output, content);
}

const fileInjector = async (config) => {
    const path = `${FIconfig.basePath}\\${config.file}`;
    let fileContent;
    try {
        fileContent = await readFile(path);
        if (!(config.placeholders && Object.keys(config.placeholders).length)) {
            return fileContent;
        }

        const injectionsMap = parseContent(fileContent);
        for (let placeholderSubstring in injectionsMap) {
            const placeholder = injectionsMap[placeholderSubstring];
            if (placeholder in config.placeholders) {
                const subConfig = config.placeholders[placeholder];
                const result = await fileInjector(subConfig);
                const replacer = [];
                const copies = subConfig.copies ? Number(subConfig.copies) : 1;
                for (let i = 0; i < copies; i++) {
                    replacer.push(result);
                }
                fileContent = fileContent.replace(new RegExp(placeholderSubstring, 'g'), replacer.join(''));
            }
        }
    } catch (e) {
        throw new Error(`attempt to processing file: "${path}"`);
    }

    return fileContent;
}

const readFile = (path) => {
    return new Promise((res, rej) => {
        fs.readFile(path, 'utf8', (err, data) => {
            if (err) rej();
            res(data);
        });
    });
}

const scanDir = (dirPath) => {
    return new Promise((res, rej) => {
        fs.readdir(dirPath, 'utf8', (err, data) => {
            if (err) rej();
            res(data);
        });
    });
}

const writeFile = (path, content) => {
    return new Promise((res, rej) => {
        fs.writeFile(path, content, (err) => {
            if (err) rej();
            res();
        });
    });
}

const parseContent = (content) => {
    const regex = /\<\!-- FileInjector:(\w+) --\>/g;

    const injectionsMap = {};
    let match;
    while ((match = regex.exec(content)) != null) {
        const [matchedSubstring, placeholder] = match;
        injectionsMap[matchedSubstring] = placeholder;
    }
    return injectionsMap;
}

const renderPageList = (urls) => {

    const htmlList = urls.map((item) => `
        <li>
            <a href="${item.url}">${item.name}</a>
        </li>
    `);
    const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=1">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <title>SX</title>
             <link rel="shortcut icon" type="image/png" href="https://auto.ndtvimg.com/car-images/medium/maruti-suzuki/alto-800/maruti-suzuki-alto-800.jpg?v=1_1"/>
            <style>
                html {
                    min-height: 100%;
                    min-width: 100%;
                }
                body {
                    padding: 0;
                    margin: 0;
                    min-height: 100%;
                    min-width: 100%;
                }

                ul{
                    counter-reset: li;
                    list-style: none;
                    font: 15px 'trebuchet MS', 'lucida sans', sans-serif;
                    padding: 0;
                    margin-bottom: 4em;
                    margin-left: 2em;
                    text-shadow: 0 1px 0 rgba(255,255,255,.5);
                }

                ul a {
                    position: relative;
                    display: block;
                    padding: .4em .4em .4em 2em;
                    margin: 1.5em 0;
                    background: linear-gradient(to right, rgba(249,198,103,0.46) 0%,rgba(249,198,102,0.46) 1%,rgba(248,172,64,0) 55%,rgba(247,150,33,0) 100%);
                    color: #444;
                    text-decoration: none;
                    border-radius: .3em;
                }

                ul a:hover{
                    background: #eee;
                }

                ul a:before{
                    content: counter(li);
                    counter-increment: li;
                    position: absolute;
                    left: -1.3em;
                    top: 50%;
                    margin-top: -1.3em;
                    background: #f63;
                    height: 2em;
                    width: 2em;
                    line-height: 2em;
                    border: .3em solid #fff;
                    text-align: center;
                    font-weight: bold;
                    border-radius: 2em;
                }
            </style>
        </head>
        <body>
            <div class="app">
                <ul>${htmlList.join('')}</ul>
            </div>
        </body>
        </html>
    `;

    return html;
}

const processing = async (dirPath, templatesBasePath = false, urlBaseDirectoryFI = false) => {
    if (templatesBasePath) {
        FIconfig.basePath = templatesBasePath;
    }
    const configsDirPath = `${dirPath}\\configs`;
    const outputDirPath = `${dirPath}\\output`;
    const outputUrlRelativePath = outputDirPath.replace(urlBaseDirectoryFI, '.').replace(/\\/g, '/');
    const configFiles = await scanDir(configsDirPath);
    // console.log(configFiles);
    const urls = [];

    for (let configFile of configFiles) {
        const filename = configFile.split('.').slice(0, -1).join('.');
        const outputFile = `${outputDirPath}\\${filename}.html`;
        urls.push({
            url: `${outputUrlRelativePath}/${filename}.html`,
            name: filename
        });
        configFile = `${configsDirPath}\\${configFile}`;
        const config = requireUncached(configFile);
        try {
            await createFile(outputFile, config);
        } catch (e) {
            console.log(`FILE_INJECTOR: error has been occured! Cannot compose file "${filename}"`);
            console.log({
                outputFile,
                configFile,
                basePath: FIconfig.basePath,
                errorMessage: e.message
            });
        }
    }

    const pagesListFile= `${urlBaseDirectoryFI}\\index.html`
    await writeFile(pagesListFile, renderPageList(urls));

}

module.exports = processing;
