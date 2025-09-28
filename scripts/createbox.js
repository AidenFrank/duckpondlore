const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// --- Helpers ---
function ask(question, defaultValue) {
    return new Promise((resolve) => {
        const prompt = defaultValue ? `${question} [default: ${defaultValue}] ` : `${question} `;
        rl.question(prompt, (answer) => {
            resolve((answer || defaultValue).toString().trim());
        });
    });
}

function tailwindSizeClasses(width, height) {
    return `w-[${width}px] h-[${height}px]`;
}

function chooseFileFromDir(dir) {
    const files = fs.existsSync(dir)
        ? fs.readdirSync(dir).filter((f) => !fs.lstatSync(path.join(dir, f)).isDirectory())
        : [];

    return new Promise((resolve) => {
        if (files.length === 0) {
            console.log('⚠️ No files found in ' + dir);
            rl.question('Type a custom path: ', (answer) => resolve(answer.trim() || null));
            return;
        }

        console.log('\nAvailable files:');
        files.forEach((file, i) => {
            console.log(`  [${i + 1}] ${file}`);
        });

        rl.question('Choose a file by number or type a custom path: ', (answer) => {
            if (!answer.trim()) {
                resolve(null);
            } else if (!isNaN(answer)) {
                const idx = parseInt(answer, 10) - 1;
                if (idx >= 0 && idx < files.length) {
                    resolve('/gifs/' + files[idx]);
                } else {
                    console.error('❌ Invalid number.');
                    resolve(null);
                }
            } else {
                resolve(answer.trim());
            }
        });
    });
}

// --- Main Script ---
(async function () {
    try {
        const boxName = (await ask('Box name (lowercase, no spaces): ')).trim();
        if (!boxName) {
            console.error('❌ Box name cannot be empty.');
            process.exit(1);
        }

        const pascalName = boxName.charAt(0).toUpperCase() + boxName.slice(1);
        const type = (await ask('Box type (image/text): ', 'image')).toLowerCase();

        // Decide folder path (gifboxes for image, root for text)
        const baseDir = type === 'image' ? '../boxes/gifboxes' : '../boxes';
        const folderName = boxName;
        const boxDir = path.join(__dirname, baseDir, folderName);

        if (fs.existsSync(boxDir)) {
            console.error('❌ Folder already exists: ' + boxDir);
            process.exit(1);
        }
        fs.mkdirSync(boxDir, { recursive: true });

        const indexFilePath = path.join(boxDir, 'index.jsx');
        const registryFilePath = path.join(__dirname, '../boxes/registry.jsx');

        let indexContent = '';

        if (type === 'image') {
            const title = await ask('Title: ', pascalName);

            const publicDir = path.join(__dirname, '../public/gifs');
            let src = await chooseFileFromDir(publicDir);
            if (!src) src = '/gifs/example.gif';

            const alt = await ask('Alt text: ', title);
            const headerColor = await ask('Header color (e.g. from-blue-900): ', '');
            const icon = await ask('Icon path (optional): ', '');
            const initialX = await ask('Initial X', '100');
            const initialY = await ask('Initial Y', '100');
            const width = await ask('Box width (px)', '300');
            const height = await ask('Box height (px)', '300');

            const sizeClasses = tailwindSizeClasses(width, height);

            const esc = (s) => (s ? s.replace(/'/g, "\\'") : s);

            indexContent =
                "import { createImageBox } from '../../utils/createimagebox';\n\n" +
                `const ${pascalName}Box = createImageBox({\n` +
                `  id: '${esc(boxName)}',\n` +
                `  title: '${esc(title)}',\n` +
                `  src: '${esc(src)}',\n` +
                `  alt: '${esc(alt)}',\n` +
                (headerColor ? `  headerColor: '${esc(headerColor)}',\n` : '') +
                (icon ? `  icon: '${esc(icon)}',\n` : '') +
                `  initialX: ${initialX},\n` +
                `  initialY: ${initialY},\n` +
                `  sizeClasses: '${sizeClasses}',\n` +
                "  order: 'order-1',\n" +
                '});\n\n' +
                `export default ${pascalName}Box;\n`;

            fs.writeFileSync(indexFilePath, indexContent, 'utf8');
        } else {
            const title = await ask('Title: ', pascalName);
            const headerColor = await ask('Header color (optional): ', '');
            const initialX = await ask('Initial X', '100');
            const initialY = await ask('Initial Y', '100');

            const contentFileName = folderName + 'content.jsx';
            const contentFilePath = path.join(boxDir, contentFileName);

            const contentFile =
                `export default function ${pascalName}Content() {\n` +
                '  return (\n' +
                '    <div className="flex flex-col items-center gap-4">\n' +
                `      <p>This is the ${pascalName} box content.</p>\n` +
                '    </div>\n' +
                '  );\n' +
                '}\n';

            fs.writeFileSync(contentFilePath, contentFile, 'utf8');

            const esc = (s) => (s ? s.replace(/'/g, "\\'") : s);

            indexContent =
                `import ${pascalName}Content from './${contentFileName}';\n\n` +
                `const ${pascalName}Box = {\n` +
                `  id: '${esc(boxName)}',\n` +
                `  title: '${esc(title)}',\n` +
                (headerColor ? `  headerColor: '${esc(headerColor)}',\n` : '') +
                `  initialX: ${initialX},\n` +
                `  initialY: ${initialY},\n` +
                "  order: 'order-1',\n" +
                "  contentClassName: 'flex flex-col items-center gap-4',\n" +
                `  content: <${pascalName}Content />, \n` +
                '};\n\n' +
                `export default ${pascalName}Box;\n`;

            fs.writeFileSync(indexFilePath, indexContent, 'utf8');
        }

        // Update registry
        if (!fs.existsSync(registryFilePath)) {
            console.error('❌ Could not find registry.jsx at: ' + registryFilePath);
            process.exit(1);
        }

        const registryContent = fs.readFileSync(registryFilePath, 'utf8');
        const relativeFolder = type === 'image' ? 'gifboxes/' + folderName : folderName;
        const newEntry = `  ${boxName}: () => import('./${relativeFolder}'),\n`;

        if (registryContent.indexOf(`${boxName}: () => import`) !== -1) {
            console.warn(`⚠️ Registry already contains "${boxName}". Skipping update.`);
        } else {
            const updatedRegistry = registryContent.replace(
                /export const allBoxes = {\s*/,
                (match) => match + newEntry
            );
            fs.writeFileSync(registryFilePath, updatedRegistry, 'utf8');
            console.log(`✅ Added ${boxName} to registry.`);
        }

        console.log(`✅ Created ${folderName} (${type}) successfully.`);
        rl.close();
    } catch (err) {
        console.error('❌ Error creating box:', err);
        rl.close();
        process.exit(1);
    }
})();
