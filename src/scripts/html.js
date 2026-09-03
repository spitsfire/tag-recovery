import { ICON_SVGS } from "./settings";

/*
FORMATS RECORD'S TIMESTAMP
FROM LOCAL STORAGE
*/
function formatDate(date) {
  const hh = date?.getHours() % 12 || 12;
  const min =
    date?.getMinutes() < 10 ? `0${date?.getMinutes()}` : date?.getMinutes();
  const mm = date?.getMonth() + 1;
  const dd = date?.getDate();
  const mer = date?.getHours() >= 12 ? "pm" : "am";
  return `${hh}:${min}${mer} - ${mm}/${dd}`;
}

export function renderRecords(records, recordsNode) {
  const storageContainer = document.createElement("div");
  storageContainer.id = "tag-storage-container";

  const table = document.createElement("table");
  table.id = "records-table";
  table.setAttribute("role", "grid");
  const tableBody = document.createElement("tbody");
  table.appendChild(tableBody);
  storageContainer.appendChild(table);

  if (records.length < 1) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.id = "no-texts";
    cell.textContent = "No saved tags yet.";
    row.appendChild(cell);
    tableBody.appendChild(row);
  } else {
    for (const record of records.toReversed()) {
      const row = document.createElement("tr");
      row.id = record?.id || "";
      row.className = "record-row";

      const tagCell = document.createElement("td");
      tagCell.className = "tag-text";
      tagCell.textContent = record?.tag || "";

      const timestampCell = document.createElement("td");
      timestampCell.className = "timestamp";
      timestampCell.textContent = formatDate(new Date(record?.timestamp));

      row.append(tagCell, timestampCell);
      tableBody.appendChild(row);
    }
  }

  recordsNode.replaceChildren(storageContainer);
}

export function createIcon(iconSvg) {
  const allowedIcons = Object.values(ICON_SVGS);
  const svgMarkup = allowedIcons.includes(iconSvg) ? iconSvg : ICON_SVGS.mascot;
  const svgDocument = new DOMParser().parseFromString(
    svgMarkup,
    "image/svg+xml",
  );
  const svg = svgDocument.documentElement;

  if (svg.nodeName !== "svg") {
    throw new Error("Could not load the selected recovery icon.");
  }

  svg.id = "tag-recovery";
  return document.importNode(svg, true);
}
