const fs = require('fs');
const JavaScriptObfuscator = require('javascript-obfuscator');

async function run() {
    try {
        const url = 'https://raw.githubusercontent.com/cmliu/edgetunnel/refs/heads/main/_worker.js';
        console.log(`正在下载原始代码: ${url}`);
        
        const res = await fetch(url);
        if (!res.ok) throw new Error(`下载失败，状态码: ${res.status}`);
        const originalCode = await res.text();

        console.log('正在进行安全混淆...');
        // 混淆配置：只混淆内部变量，绝对不碰字符串和全局入口
        const obfuscationResult = JavaScriptObfuscator.obfuscate(originalCode, {
            compact: true,
            controlFlowFlattening: false,
            deadCodeInjection: false,
            debugProtection: false,
            disableConsoleOutput: false,
            identifierNamesGenerator: 'hexadecimal', // 生成 _0xabc123 风格的变量
            log: false,
            numbersToExpressions: false,
            renameGlobals: false, // 关键：不重命名全局变量（如 export default），确保 CF Worker 正常运行
            selfDefending: false,
            simplify: true,
            splitStrings: false,
            stringArray: false, // 关键：不抽取字符串，保证前端 HTML/JS 源码完全可见、可读
            unicodeEscapeSequence: false
        });

        let obfuscatedCode = obfuscationResult.getObfuscatedCode();

        console.log('正在将混淆变量名替换为随机汉字...');
        // 匹配所有 _0x 开头的混淆变量名
        const hexRegex = /_0x[0-9a-fA-F]+/g;
        const matches = obfuscatedCode.match(hexRegex) || [];
        const uniqueHexes = [...new Set(matches)];

        const hexToChineseMap = {};
        const usedChars = new Set();

        // 随机汉字生成器 (常用汉字区间: 0x4E00 到 0x9FA5)
        function getRandomChineseChar() {
            const start = 0x4e00;
            const end = 0x9fa5;
            return String.fromCharCode(Math.floor(Math.random() * (end - start + 1)) + start);
        }

        // 为每个十六进制变量分配一个唯一的汉字
        uniqueHexes.forEach(hex => {
            let char = getRandomChineseChar();
            while (usedChars.has(char)) {
                char = getRandomChineseChar(); // 确保不重复
            }
            usedChars.add(char);
            hexToChineseMap[hex] = char;
        });

        // 长度从长到短排序，防止长变量名包含短变量名导致误替换
        uniqueHexes.sort((a, b) => b.length - a.length);

        // 全局替换
        uniqueHexes.forEach(hex => {
            const escapedHex = hex.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            const regex = new RegExp(escapedHex, 'g');
            obfuscatedCode = obfuscatedCode.replace(regex, hexToChineseMap[hex]);
        });

        // 写入根目录，同名覆盖
        fs.writeFileSync('_worker.js', obfuscatedCode, 'utf8');
        console.log('成功生成汉字变量 Worker 代码并保存至根目录！');

    } catch (error) {
        console.error('执行出错:', error);
        process.exit(1);
    }
}

run();
