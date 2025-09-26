const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('🖼️ Enter the name for your desktop icon: ', (iconName) => {
    if (!iconName) {
        console.error('❌ Icon name is required.');
        rl.close();
        return;
    }

    rl.question('📁 Enter the image path for the icon (e.g. /images/myicon.png): ', (imagePath) => {
        if (!imagePath) {
            console.error('❌ Image path is required.');
            rl.close();
            return;
        }

        const pascalName = iconName.charAt(0).toUpperCase() + iconName.slice(1);
        const fileName = `${iconName.toLowerCase()}.jsx`;
        const filePath = path.join(__dirname, '../desktopicons', fileName);
        const registryFilePath = path.join(__dirname, '../desktopicons/registry.jsx');

        // Create icon file
        fs.writeFileSync(
            filePath,
            `const ${pascalName}Icon = {
  id: '${iconName.toLowerCase()}',
  title: '${pascalName}',
  icon: '${imagePath}',
  link: '/',
  iconW: 'w-12',
  iconH: 'h-12',
  initialX: 40,
  initialY: 40,
};

export default ${pascalName}Icon;
`
        );

        // Update registry.jsx
        const registryContent = fs.readFileSync(registryFilePath, 'utf8');
        const newEntry = `  ${iconName.toLowerCase()}: () => import('./${fileName}'),\n`;

        const updatedRegistry = registryContent.replace(/export const allIcons = {\s*/, (match) => match + newEntry);

        fs.writeFileSync(registryFilePath, updatedRegistry);

        console.log(`✅ Created ${fileName} with icon "${imagePath}" and added to desktop icon registry.`);
        rl.close();
    });
});
