/* keep newest first; add an entry here each release so whats-new.html stays current */
export const CHANGELOG = [
  {
    version: "2.0.0",
    changes: [
      "Rebuilt the popup, install, and what's new pages with Tailwind CSS for a fresh, consistent look.",
      "Added a logo picker so you can choose between the mascot and quill icon styles.",
      "Introduced new mascot and quill brand artwork, including a redesigned favicon.",
      "Added a Ko-fi donation link to the popup.",
      "Replaced the external content-script stylesheet with inline styles for more reliable injection.",
      "Fixed a rare crash when displaying tag records with missing data.",
      "Polished the injected icon button and saved-tags table styling.",
    ],
  },
  {
    version: "1.4.0",
    changes: [
      "Bumped Vite and removed a stale lockfile to resolve reported dependency vulnerabilities.",
      "Added a proper sans-serif font stack for a cleaner look.",
      "Increased the default 'save tag after' debounce from 3.5s to 5s for more reliable saves.",
      "Added install and update pages with a changelog and a link to support the project.",
      "Removed leftover legacy assets no longer used by the extension.",
    ],
  },
  {
    version: "1.3.0",
    changes: [
      "Fixed username detection to use the logged-in cookie user instead of the first profile link found on the page.",
      "Added a 'save tag after _ ms of inactivity' setting alongside the existing expiration-days setting.",
      "The 'no logged-in user found' message no longer appears on pages without a comment form, or for visitors who simply aren't logged in yet.",
      "Added Firefox support alongside Chrome.",
    ],
  },
];
