import * as fs from "node:fs";
import * as path from "node:path";

/**
 * 构建智能冰箱留给主人的单行阴阳怪气门屏便签（终版）。
 * 结合库存系统推送口吻与具体生活细节（香菜与堆肥抽屉标签切换），
 * 在单行 200 字符以内提供干脆利落的反转与刺痛感。
 */
function composeFridgeNote(): string {
  return "Inventory update: I switched your crisper drawer from 'Produce' to 'Compost' so we can both stop pretending about that cilantro.";
}

/**
 * 校验便签文本是否满足竞赛门控要求：
 * 1. 非空且非纯空白字符；
 * 2. 严格单行，不包含任何换行符或首尾冗余空白；
 * 3. Unicode 字符数严格处于 1 到 200 之间。
 */
function validateNote(note: string): void {
  if (note.trim().length === 0) {
    throw new Error("生成的便签不能为空白字符。");
  }
  if (note !== note.trim()) {
    throw new Error("生成的便签不应包含首尾空白字符。");
  }
  if (note.includes("\n") || note.includes("\r")) {
    throw new Error("便签必须严格为单行文本，不能包含换行符。");
  }
  const charCount = [...note].length;
  if (charCount < 1 || charCount > 200) {
    throw new Error(`便签字符数超出 [1, 200] 限制：当前为 ${charCount}。`);
  }
}

function main(): void {
  const outputDir = process.env.TEST_OUTPUT_DIR || "/output";
  const outputPath = path.join(outputDir, "entry.txt");

  const note = composeFridgeNote();
  validateNote(note);

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputPath, note, { encoding: "utf8", mode: 0o644 });
  fs.chmodSync(outputPath, 0o644);

  // 回读校验，确保落盘 UTF-8 字节与目标内容完全一致
  const persisted = fs.readFileSync(outputPath, "utf8");
  if (persisted !== note) {
    throw new Error("落盘后的文件内容校验不一致。");
  }

  const byteLen = Buffer.byteLength(persisted, "utf8");
  console.log(`Wrote ${outputPath} (${[...persisted].length} chars, ${byteLen} bytes)`);
}

main();
