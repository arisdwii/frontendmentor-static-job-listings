const jobListingsContainer = document.querySelector(".job-listings-container");
const filterBar = document.querySelector(".filter-bar");
const filterTagsContainer = document.querySelector(".filter-tags");
const clearFilterBtn = document.querySelector(".clear-filter");

let jobData = [];
let activeFilters = [];

// === Fetch Data ===
async function getJobArticle() {
  try {
    const res = await fetch("data.json");
    jobData = await res.json();

    renderJobCards();
  } catch (error) {
    console.error("Failed to fetch jobs:", error);
  }
}

// === Render All Job Cards ===
function renderJobCards() {
  const jobsToRender = getFilteredJobs(jobData);
  jobListingsContainer.innerHTML = jobsToRender
    .map(generateJobCardHTML)
    .join("");

  attachTagListeners();
  updateFilterBar();
}

// === Filter Logic ===
function getFilteredJobs(data) {
  if (!activeFilters.length) return data;

  return data.filter((job) => {
    const tags = collectTags(job);
    return activeFilters.every((filter) => tags.includes(filter));
  });
}

// === Create Job Card HTML ===
function generateJobCardHTML(job) {
  const tags = collectTags(job);
  const tagsHTML = tags
    .map(
      (tag) =>
        `<li><button class="tag-btn" data-tag="${tag}">${tag}</button></li>`
    )
    .join("");

  return `
    <article class="job-card ${job.featured ? "featured" : ""}">
      <img src="${job.logo}" alt="${
    job.company
  } logo" class="company-logo" draggable="false" />
      <div class="job-wrapper">
        <div class="job-content">
          <div class="job-header">
            <h3 class="company-name">${job.company}</h3>
            ${job.new ? `<span class="badge new">New!</span>` : ""}
            ${
              job.featured ? `<span class="badge featured">Featured</span>` : ""
            }
          </div>
          <a href="#" class="job-title">${job.position}</a>
          <p class="job-meta">${job.postedAt} · ${job.contract} · ${
    job.location
  }</p>
        </div>
        <ul class="job-tags">${tagsHTML}</ul>
      </div>
    </article>`;
}

// === Helper: Collect All Tags from Job ===
function collectTags(job) {
  return [job.role, job.level, ...(job.languages || []), ...(job.tools || [])];
}

// === Add Event Listeners to Tags ===
function attachTagListeners() {
  document.querySelectorAll(".tag-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const tag = btn.dataset.tag;
      if (!activeFilters.includes(tag)) {
        activeFilters.push(tag);
        renderJobCards();
      }
    });
  });
}

// === Render Filter Bar ===
function updateFilterBar() {
  if (!activeFilters.length) {
    filterBar.style.display = "none";
    return;
  }

  filterBar.style.display = "block";

  filterTagsContainer.innerHTML = activeFilters
    .map(
      (tag) =>
        `<li class="filter-tag">
      <p>${tag}</p>
      <button class="remove-tag" data-tag="${tag}" aria-label="Remove ${tag} filter"></button>
    </li>`
    )
    .join("");

  document.querySelectorAll(".remove-tag").forEach((btn) => {
    btn.addEventListener("click", () => {
      const tag = btn.dataset.tag;
      activeFilters = activeFilters.filter((t) => t !== tag);
      renderJobCards();
    });
  });
}

// === Clear Filter Button ===
clearFilterBtn.addEventListener("click", () => {
  activeFilters = [];
  renderJobCards();
});

// Init
getJobArticle();
