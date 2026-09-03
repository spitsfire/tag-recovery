import { CHANGELOG } from "./changelog";
import "../styles/whats-new.css";

const list = document.getElementById("changelog-list");
CHANGELOG.forEach(({ version, changes }) => {
  const entry = document.createElement("div");
  entry.className = "border-l-2 border-lilac pl-5";

  const heading = document.createElement("h2");
  heading.className = "font-display text-lg font-semibold";
  heading.textContent = `v${version}`;
  entry.appendChild(heading);

  const ul = document.createElement("ul");
  ul.className = "mt-3 space-y-2 text-sm leading-relaxed text-ink/70";
  changes.forEach((change) => {
    const li = document.createElement("li");
    li.className = "flex gap-2.5";
    li.innerHTML = `<svg
      viewBox="0 0 16 16"
      class="h-5 w-4 shrink-0 mt-0.5 text-coral"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M8 1.6c1.7 1.1 3.6 1.7 5.2 1.9.6.1 1 .5 1 1.1v4.5c0 3.9-2.7 6.3-5.8 7.6a1 1 0 0 1-.8 0C4.5 15.4 1.8 13 1.8 9.1V4.6c0-.6.4-1 1-1.1C4.4 3.3 6.3 2.7 8 1.6Z"
        fill="currentColor"
      ></path>
    </svg>`;
    const text = document.createElement("span");
    text.textContent = change;
    li.appendChild(text);
    ul.appendChild(li);
  });
  entry.appendChild(ul);

  list.appendChild(entry);
});
