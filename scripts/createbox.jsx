const fs = require('fs');
const path = require('path');

const boxName = process.argv[2];
if (!boxName) {
  console.error('❌ Please provide a box name');
  process.exit(1);
}

const pascalName = boxName.charAt(0).toUpperCase() + boxName.slice(1);
const folderName = `${boxName.toLowerCase()}box`;
const contentFileName = `${boxName.toLowerCase()}content.jsx`;

const boxDir = path.join(__dirname, '../boxes', folderName);
const contentFilePath = path.join(boxDir, contentFileName);
const indexFilePath = path.join(boxDir, 'index.jsx');
const registryFilePath = path.join(__dirname, '../boxes/registry.jsx');

// Create folder
if (!fs.existsSync(boxDir)) {
  fs.mkdirSync(boxDir);
}

// Create content file
fs.writeFileSync(
  contentFilePath,
  `export default function ${pascalName}Content() {
  return (
    <div className="">
      <p>This is the ${pascalName} box content.</p>
    </div>
  );
}
`
);

// Create index.jsx
fs.writeFileSync(
  indexFilePath,
  `import ${pascalName}Content from './${contentFileName}';

const ${pascalName}Box = {
  id: '${boxName.toLowerCase()}',
  title: '${pascalName}',
  initialX: 100,
  initialY: 100,
  order: 'order-1',
  content: <${pascalName}Content />,
};

export default ${pascalName}Box;
`
);

// Update registry.jsx
const registryContent = fs.readFileSync(registryFilePath, 'utf8');
const newEntry = `  ${boxName.toLowerCase()}: () => import('./${folderName}'),\n`;

const updatedRegistry = registryContent.replace(
  /export const allBoxes = {\s*/,
  match => match + newEntry
);

fs.writeFileSync(registryFilePath, updatedRegistry);

console.log(`✅ Created ${folderName} with ${contentFileName} and added to registry.`);