#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const FILES_TO_DOWNLOAD = [
    {
        url: 'https://raw.githubusercontent.com/garridomartin/snake-timeline/refs/heads/main/src/components/snakeTimeline/SnakeTimeline.tsx',
        subPath: 'components/ui/snakeTimeline/SnakeTimeline.tsx',
    },
    {
        url: 'https://raw.githubusercontent.com/garridomartin/snake-timeline/refs/heads/main/src/components/snakeTimeline/mappings/Mappings.tsx',
        subPath: 'components/ui/snakeTimeline/mappings/Mappings.tsx',
    },
    {
        url: 'https://raw.githubusercontent.com/garridomartin/snake-timeline/refs/heads/main/src/types/DTO/document.dto.ts',
        subPath: 'types/DTO/document.dto.ts',
    },
    {
        url: 'https://raw.githubusercontent.com/garridomartin/snake-timeline/refs/heads/main/src/types/enums/document-state-type.enum.ts',
        subPath: 'types/enums/document-state-type.enum.ts',
    },
    {
        url: 'https://raw.githubusercontent.com/garridomartin/snake-timeline/refs/heads/main/src/types/mocks/documentStatuses.mock.ts',
        subPath: 'types/mocks/documentStatuses.mock.ts',
    },
];
async function init() {
    console.log('🐍 Starting Snake Timeline installation...');
    try {
        const isSrc = fs_extra_1.default.existsSync(path_1.default.join(process.cwd(), 'src'));
        const rootPrefix = isSrc ? 'src' : '';
        for (const file of FILES_TO_DOWNLOAD) {
            console.log(`📥 Downloading ${path_1.default.basename(file.url)}...`);
            const response = await fetch(file.url);
            if (!response.ok)
                throw new Error(`Could not download: ${file.url}`);
            const content = await response.text();
            const targetPath = path_1.default.join(process.cwd(), rootPrefix, file.subPath);
            await fs_extra_1.default.ensureDir(path_1.default.dirname(targetPath));
            await fs_extra_1.default.writeFile(targetPath, content);
            console.log(`✅ Saved to ${path_1.default.join(rootPrefix, file.subPath)}`);
        }
        const possibleCssPaths = [
            path_1.default.join(process.cwd(), 'src', 'app', 'global.css'),
            path_1.default.join(process.cwd(), 'src', 'app', 'globals.css'),
            path_1.default.join(process.cwd(), 'app', 'global.css'),
            path_1.default.join(process.cwd(), 'app', 'globals.css'),
            path_1.default.join(process.cwd(), 'src', 'index.css'),
            path_1.default.join(process.cwd(), 'index.css'),
        ];
        console.log('🔍 Searching for CSS file...');
        const cssPath = possibleCssPaths.find((p) => fs_extra_1.default.existsSync(p));
        if (cssPath) {
            const extraStyles = `
/* Snake Timeline Styles */
.arrow-right-l::after {
    content: '';
    position: absolute;
    left: 63px;
    margin-top: 2px;
    transform: translateY(-50%) rotate(-90deg);
    border-width: 10px;
    border-style: solid;
    border-color: #4a5568 transparent transparent transparent;
}
.vertical-left::after {
    content: '';
    position: absolute;
    left: -5px;
    margin-top: 73px;
    transform: translateY(-50%);
    height: 135px;
    width: 2px;
    border-right: 4px dashed #4a5568;
}
.vertical-right::after {
    content: '';
    position: absolute;
    right: -10px;
    margin-top: 73px;
    transform: translateY(-50%);
    height: 135px;
    width: 2px;
    border-right: 4px dashed #4a5568;
}
.arrow-to-left-r::after {
    content: '';
    position: absolute;
    right: 59px;
    margin-top: 2px;
    transform: translateY(-50%) rotate(90deg);
    border-width: 10px;
    border-style: solid;
    border-color: #4a5568 transparent transparent transparent;
}
`;
            fs_extra_1.default.appendFileSync(cssPath, extraStyles);
            console.log(`✅ Styles added to: ${path_1.default.relative(process.cwd(), cssPath)}`);
        }
        console.log('📦 Installing dependencies...');
        (0, child_process_1.execSync)('npm install date-fns lucide-react framer-motion --no-fund --no-audit', { stdio: 'inherit' });
        console.log('\n🚀 Installation completed! Check your "components/ui" and "types/DTO" folders.');
    }
    catch (error) {
        console.error('❌ Error during installation:', error);
    }
}
init();
