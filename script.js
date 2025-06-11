const jobListingsContainer = document.querySelector(".job-listings-container");
const filterBar = document.querySelector(".filter-bar");
const filterTagsContainer = document.querySelector(".filter-tags");
const clearFilterBtn = document.querySelector(".clear-filter");

let jobData = [];
let activeFilters = [];

async function getJobArticle() {
  try {
    const res = await fetch("data.json");
    const data = await res.json();
    jobData = data;

    renderJobCard(data);
  } catch (error) {
    console.log(error);
  }
}

function renderJobCard(data) {
  const filteredData = activeFilters.length
    ? data.filter((item) => {
        const tags = [
          item.role,
          item.level,
          ...(item.languages || []),
          ...(item.tools || []),
        ];

        return activeFilters.every((filter) => tags.includes(filter));
      })
    : data;

  const cardHTML = filteredData.map((item) => {
    const tags = [
      item.role,
      item.level,
      ...(item.languages || []),
      ...(item.tools || []),
    ];

    const tagsHTML = tags
      .map(
        (tag) =>
          `<li><button class="tag-btn" data-tag="${tag}">${tag}</button></li>`
      )
      .join("");

    return `
    <article class="job-card ${item.featured ? "featured" : ""}">
        <img 
            src="${item.logo}" 
            alt="${item.company} company logo" 
            class="company-logo" draggable="false">

        <div class="job-wrapper">
          <div class="job-content">
            <div class="job-header">
              <h3 class="company-name">${item.company}</h3>
              ${item.new ? '<span class="badge new">New!</span>' : ""}
              ${
                item.featured
                  ? '<span class="badge featured">Featured</span>'
                  : ""
              }
            </div>

            <a href="" class="job-title">${item.position}</a>

            <p class="job-meta">${item.postedAt} · ${item.contract} · ${
      item.location
    }</p>
          </div>

          <ul class="job-tags">${tagsHTML}</ul>
        </div>
    </article>`;
  });

  jobListingsContainer.innerHTML = cardHTML.join("");
  addTagClickListeners();
  renderFilterBar();
}

function addTagClickListeners() {
  document.querySelectorAll(".tag-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const tag = btn.dataset.tag;
      if (!activeFilters.includes(tag)) {
        activeFilters.push(tag);
        renderJobCard(jobData);
      }
    });
  });
}

function renderFilterBar() {
  if (activeFilters.length === 0) {
    filterBar.style.display = "none";
    return;
  }

  filterBar.style.display = "block";

  filterTagsContainer.innerHTML = activeFilters
    .map(
      (tag) => `
        <li class="filter-tag">
          <p>${tag}</p>
          <button type="reset" class="remove-tag" data-tag="${tag}" aria-label="Remove ${tag} filter"></button>
        </li>`
    )
    .join("");

  document.querySelectorAll(".remove-tag").forEach((btn) => {
    btn.addEventListener("click", () => {
      const tag = btn.dataset.tag;
      activeFilters = activeFilters.filter((t) => t !== tag);
      renderJobCard(jobData);
    });
  });
}

clearFilterBtn.addEventListener("click", () => {
  activeFilters = [];
  renderJobCard(jobData);
});

getJobArticle();
