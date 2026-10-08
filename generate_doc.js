const fs = require("fs");
const path = require("path");
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  AlignmentType,
  WidthType,
  BorderStyle,
  PageBreak,
} = require("docx");

// Import target file
const sourcePath = "c:/Users/User/Downloads/monografia_amancio (2).js";
const data = require(sourcePath);

const FONT = "Times New Roman";
const SIZE_BODY = 24; // 12pt (docx uses half-points)
const SIZE_H1 = 32; // 16pt
const SIZE_H2 = 28; // 14pt
const SIZE_H3 = 26; // 13pt
const SIZE_CAPTION = 20; // 10pt

// Helper for standard body text paragraph
function createParagraph(text, options = {}) {
  return new Paragraph({
    alignment: options.alignment || AlignmentType.JUSTIFY,
    spacing: {
      line: 360, // 1.5 line spacing
      after: options.spaceAfter !== undefined ? options.spaceAfter : 140, // ~7pt space after
      before: options.spaceBefore !== undefined ? options.spaceBefore : 0,
    },
    indent: options.firstLineIndent ? { firstLine: 708 } : undefined, // 1.25 cm
    children: [
      new TextRun({
        text: text,
        font: FONT,
        size: SIZE_BODY,
        bold: options.bold || false,
        italics: options.italic || false,
      }),
    ],
  });
}

// Helper for multi-run paragraphs (bold term + definition, etc.)
function createRichParagraph(runs, options = {}) {
  return new Paragraph({
    alignment: options.alignment || AlignmentType.JUSTIFY,
    spacing: {
      line: 360,
      after: options.spaceAfter !== undefined ? options.spaceAfter : 140,
      before: options.spaceBefore !== undefined ? options.spaceBefore : 0,
    },
    indent: options.firstLineIndent ? { firstLine: 708 } : undefined,
    children: runs.map(
      (r) =>
        new TextRun({
          text: r.text,
          font: FONT,
          size: r.size || SIZE_BODY,
          bold: r.bold || false,
          italics: r.italic || false,
        })
    ),
  });
}

// Helper for bullet list item
function createListItem(text, prefix = "• ") {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFY,
    spacing: { line: 360, after: 100 },
    indent: { left: 708, hanging: 360 }, // hanging indent for bullets
    children: [
      new TextRun({
        text: prefix + text,
        font: FONT,
        size: SIZE_BODY,
      }),
    ],
  });
}

// Helper for numbered list item
function createNumberedItem(numberStr, text) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFY,
    spacing: { line: 360, after: 100 },
    indent: { left: 708, hanging: 360 },
    children: [
      new TextRun({
        text: numberStr + " ",
        font: FONT,
        size: SIZE_BODY,
        bold: true,
      }),
      new TextRun({
        text: text,
        font: FONT,
        size: SIZE_BODY,
      }),
    ],
  });
}

// Helper for Table
function renderTable(tableData) {
  const elements = [];

  // Table Caption
  if (tableData.number || tableData.title) {
    elements.push(
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { before: 200, after: 80 },
        children: [
          new TextRun({
            text: `${tableData.number ? tableData.number + ": " : ""}${tableData.title || ""}`,
            font: FONT,
            size: SIZE_BODY,
            bold: true,
          }),
        ],
      })
    );
  }

  // Build rows
  const tableRows = [];

  // Header row
  if (tableData.columns && tableData.columns.length > 0) {
    const headerCells = tableData.columns.map((colName) => {
      return new TableCell({
        shading: { fill: "E6ECF5" },
        margins: { top: 120, bottom: 120, left: 150, right: 150 },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: colName,
                font: FONT,
                size: SIZE_BODY,
                bold: true,
              }),
            ],
          }),
        ],
      });
    });
    tableRows.push(new TableRow({ children: headerCells }));
  }

  // Data rows
  if (tableData.rows && tableData.rows.length > 0) {
    tableData.rows.forEach((row, rowIndex) => {
      const cells = row.map((cellText) => {
        return new TableCell({
          shading: rowIndex % 2 === 1 ? { fill: "F9FAFC" } : undefined,
          margins: { top: 100, bottom: 100, left: 150, right: 150 },
          children: [
            new Paragraph({
              alignment: AlignmentType.LEFT,
              spacing: { line: 280 },
              children: [
                new TextRun({
                  text: String(cellText),
                  font: FONT,
                  size: SIZE_BODY - 2, // 11pt inside table
                }),
              ],
            }),
          ],
        });
      });
      tableRows.push(new TableRow({ children: cells }));
    });
  }

  if (tableRows.length > 0) {
    elements.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: tableRows,
      })
    );
  }

  // Source & Note below table
  if (tableData.source) {
    elements.push(
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { before: 80, after: 140 },
        children: [
          new TextRun({
            text: `Fonte: ${tableData.source}`,
            font: FONT,
            size: SIZE_CAPTION,
            italics: true,
          }),
        ],
      })
    );
  }
  if (tableData.note) {
    elements.push(
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { before: 40, after: 140 },
        children: [
          new TextRun({
            text: `Nota: ${tableData.note}`,
            font: FONT,
            size: SIZE_CAPTION,
            italics: true,
          }),
        ],
      })
    );
  }

  return elements;
}

// Helper for Figure
function renderFigure(figData) {
  const elements = [];

  // Caption
  if (figData.number || figData.title) {
    elements.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 100 },
        children: [
          new TextRun({
            text: `${figData.number ? figData.number + ": " : ""}${figData.title || ""}`,
            font: FONT,
            size: SIZE_BODY,
            bold: true,
          }),
        ],
      })
    );
  }

  // Placeholder Box
  if (figData.placeholder) {
    elements.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                shading: { fill: "F5F5F5" },
                margins: { top: 200, bottom: 200, left: 200, right: 200 },
                borders: {
                  top: { style: BorderStyle.DASHED, size: 4, color: "888888" },
                  bottom: { style: BorderStyle.DASHED, size: 4, color: "888888" },
                  left: { style: BorderStyle.DASHED, size: 4, color: "888888" },
                  right: { style: BorderStyle.DASHED, size: 4, color: "888888" },
                },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({
                        text: figData.placeholder,
                        font: FONT,
                        size: SIZE_BODY,
                        italics: true,
                        color: "555555",
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      })
    );
  }

  // Source
  if (figData.source) {
    elements.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 80, after: 200 },
        children: [
          new TextRun({
            text: `Fonte: ${figData.source}`,
            font: FONT,
            size: SIZE_CAPTION,
            italics: true,
          }),
        ],
      })
    );
  }

  return elements;
}

// Process a block object (section, subsection, sub-block)
function processBlock(block) {
  const elements = [];

  // Section Heading
  if (block.number || block.title) {
    const level = block.level || 1;
    const titleText = `${block.number ? block.number + " " : ""}${block.title || ""}`;

    let headingSize = SIZE_H2;
    let spaceBefore = 240;

    if (level === 1) {
      headingSize = SIZE_H2;
      spaceBefore = 300;
    } else if (level === 2) {
      headingSize = SIZE_H3;
      spaceBefore = 240;
    }

    elements.push(
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { before: spaceBefore, after: 120 },
        heading: level === 1 ? HeadingLevel.HEADING_2 : HeadingLevel.HEADING_3,
        children: [
          new TextRun({
            text: titleText,
            font: FONT,
            size: headingSize,
            bold: true,
          }),
        ],
      })
    );
  }

  // Label (e.g. "Requisitos Funcionais:")
  if (block.label) {
    elements.push(
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { before: 140, after: 100 },
        children: [
          new TextRun({
            text: block.label,
            font: FONT,
            size: SIZE_BODY,
            bold: true,
          }),
        ],
      })
    );
  }

  // Paragraph arrays
  const paraKeys = [
    "paragraphs",
    "trailingParagraphs",
    "closingParagraphs",
    "moreParagraphs",
    "evenMoreParagraphs",
    "finalParagraphs",
  ];

  paraKeys.forEach((key) => {
    if (block[key] && Array.isArray(block[key])) {
      block[key].forEach((pText) => {
        if (typeof pText === "string") {
          elements.push(createParagraph(pText, { firstLineIndent: true }));
        }
      });
    }
  });

  // Bullet list
  if (block.list && Array.isArray(block.list)) {
    block.list.forEach((item) => {
      elements.push(createListItem(item));
    });
  }

  // Numbered list
  if (block.numberedList && Array.isArray(block.numberedList)) {
    block.numberedList.forEach((item, index) => {
      elements.push(createNumberedItem(`${index + 1}.`, item));
    });
  }

  // Definition list
  if (block.definitionList && Array.isArray(block.definitionList)) {
    block.definitionList.forEach((d) => {
      elements.push(
        createRichParagraph([
          { text: `${d.term}: `, bold: true },
          { text: d.definition },
        ])
      );
    });
  }

  // Tables
  const tableKeys = ["table", "tables", "tables2", "tables3", "tables4", "tables5", "useCaseTables"];
  tableKeys.forEach((key) => {
    if (block[key]) {
      const val = block[key];
      if (Array.isArray(val)) {
        val.forEach((t) => elements.push(...renderTable(t)));
      } else {
        elements.push(...renderTable(val));
      }
    }
  });

  // Figures
  if (block.figure) elements.push(...renderFigure(block.figure));
  if (block.figure2) elements.push(...renderFigure(block.figure2));
  if (block.figures && Array.isArray(block.figures)) {
    block.figures.forEach((f) => elements.push(...renderFigure(f)));
  }

  // Subsections
  if (block.subsections && Array.isArray(block.subsections)) {
    block.subsections.forEach((sub) => {
      elements.push(...processBlock(sub));
    });
  }

  return elements;
}

function generateMonographDoc() {
  const docElements = [];

  const chapterKeys = ["capituloI", "capituloII", "capituloIII", "capituloIV", "capituloV"];

  chapterKeys.forEach((key, idx) => {
    const cap = data[key];
    if (!cap) return;

    if (idx > 0) {
      docElements.push(new Paragraph({ children: [new PageBreak()] }));
    }

    // Chapter Header
    if (cap.chapter) {
      docElements.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 360, after: 240 },
          heading: HeadingLevel.HEADING_1,
          children: [
            new TextRun({
              text: cap.chapter,
              font: FONT,
              size: SIZE_H1,
              bold: true,
            }),
          ],
        })
      );
    }

    // Intro paragraphs
    if (cap.intro && Array.isArray(cap.intro)) {
      cap.intro.forEach((pText) => {
        docElements.push(createParagraph(pText, { firstLineIndent: true }));
      });
    }

    // Sections
    if (cap.sections && Array.isArray(cap.sections)) {
      cap.sections.forEach((section) => {
        docElements.push(...processBlock(section));
      });
    }

    // Chapter References / Notes
    if (cap.references && Array.isArray(cap.references)) {
      cap.references.forEach((ref) => {
        if (ref.note) {
          docElements.push(
            new Paragraph({
              alignment: AlignmentType.LEFT,
              spacing: { before: 200, after: 100 },
              children: [
                new TextRun({
                  text: `Nota Bibliográfica: ${ref.note}`,
                  font: FONT,
                  size: SIZE_CAPTION,
                  italics: true,
                  bold: true,
                }),
              ],
            })
          );
        }
      });
    }
  });

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1701, // 3 cm (567 dxa per cm)
              bottom: 1134, // 2 cm
              left: 1701, // 3 cm
              right: 1134, // 2 cm
            },
          },
        },
        children: docElements,
      },
    ],
  });

  return doc;
}

async function main() {
  console.log("Gerando documento Word a partir de monografia_amancio (2).js...");
  const doc = generateMonographDoc();
  const buffer = await Packer.toBuffer(doc);

  const outputPath1 = "c:/Users/User/Downloads/monografia_amancio.docx";
  const outputPath2 = "c:/Users/User/Desktop/Trabalho/monografia_amancio.docx";

  fs.writeFileSync(outputPath1, buffer);
  fs.writeFileSync(outputPath2, buffer);

  console.log(`Documento gerado com sucesso!`);
  console.log(`Caminho 1: ${outputPath1}`);
  console.log(`Caminho 2: ${outputPath2}`);
}

main().catch((err) => {
  console.error("Erro ao gerar documento:", err);
  process.exit(1);
});
