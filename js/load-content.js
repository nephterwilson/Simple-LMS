

// js/load-content.js

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const subject = urlParams.get('subject'); // e.g., "biology"
  const titleElement = document.getElementById('subjectTitle');
  const topicsContainer = document.getElementById('topicsContainer');

  const paginationContainer = document.createElement('div');
  paginationContainer.id = 'paginationControls';
  paginationContainer.className = 'mt-10 flex justify-center items-center space-x-2 text-sm font-medium';
  topicsContainer.insertAdjacentElement('afterend', paginationContainer);

  const topicsPerPage = 15;
  let currentPage = 1;
  let allTopics = [];

 const form = urlParams.get('form'); // e.g., "form1"


if (!form || !subject) {
  titleElement.textContent = 'Form or Subject not specified!';
  return;
}

// Adjusted fetch path
fetch(`data/${form}/${subject.toLowerCase().replace(/\s+/g, '-')}.json`)
  .then(res => res.json())
  .then(data => {
    titleElement.textContent = `${data.subject} Topics`;
    allTopics = data.topics;
    renderPage(currentPage);
  })
  .catch(err => {
    titleElement.textContent = 'Failed to load subject content.';
    console.error('Error loading JSON:', err);
  });


  function renderPage(page) {
  currentPage = page;  // <-- This is essential to keep track of current page

  topicsContainer.innerHTML = '';
  const start = (page - 1) * topicsPerPage;
  const end = start + topicsPerPage;
  const topicsToShow = allTopics.slice(start, end);

  topicsToShow.forEach((topic, index) => {
    const globalIndex = start + index;
    const topicId = `topic-${globalIndex + 1}`;
    const iconId = `${topicId}-icon`;
    const panelId = `${topicId}-desc`;

    let subsectionsHTML = '';
    if (topic.subsections && topic.subsections.length > 0) {
      subsectionsHTML = topic.subsections.map(sub => `
        <div class="mt-4 border-l-4 border-indigo-300 pl-4">
          <h4 class="text-lg font-bold text-gray-800">${sub.title}</h4>
          <p class="text-gray-700">${sub.content}</p>
          <ul class="list-disc pl-5 mt-2 text-gray-600 space-y-1">
            ${sub.points.map(point => `<li>${point}</li>`).join('')}
          </ul>
        </div>
      `).join('');
    }

    topicsContainer.innerHTML += `
      <article class="bg-white rounded-lg shadow border overflow-hidden">
        <button onclick="toggleCollapse('${topicId}')" id="${topicId}-btn" 
          class="w-full flex justify-between items-center px-6 py-4 text-left focus:outline-none">
          <h3 class="text-xl font-semibold text-indigo-700">${topic.title}</h3>
          <svg id="${iconId}" class="w-6 h-6 transition-transform duration-300" fill="none" stroke="currentColor" stroke-width="2"
              viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
        <div id="${panelId}" class="px-6 pb-4 max-h-0 overflow-hidden transition-all duration-300 text-gray-700" hidden>
          ${subsectionsHTML}
        </div>
      </article>
    `;
  });

  renderPagination();
}


 function renderPagination() {
  const totalPages = Math.ceil(allTopics.length / topicsPerPage);
  paginationContainer.innerHTML = '';

  // Previous Button
  const prevBtn = document.createElement('button');
  prevBtn.textContent = '← Prev';
  prevBtn.disabled = currentPage === 1;
  prevBtn.className = `px-3 py-1 rounded border ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white text-indigo-700 hover:bg-indigo-100'}`;
  prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      renderPage(currentPage);
    }
  });
  paginationContainer.appendChild(prevBtn);

  // Page Count Display
  const pageInfo = document.createElement('span');
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
  pageInfo.className = 'px-4 text-gray-600 font-medium';
  paginationContainer.appendChild(pageInfo);

  // Next Button
  const nextBtn = document.createElement('button');
  nextBtn.textContent = 'Next →';
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.className = `px-3 py-1 rounded border ${currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white text-indigo-700 hover:bg-indigo-100'}`;
  nextBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderPage(currentPage);
    }
  });
  paginationContainer.appendChild(nextBtn);
}

});
