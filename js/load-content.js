


// js/load-content.js

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const subject = urlParams.get('subject');
  const titleElement = document.getElementById('subjectTitle');
  const topicsContainer = document.getElementById('topicsContainer');

  if (!subject) {
    titleElement.textContent = 'Subject not specified!';
    return;
  }

  fetch(`data/${subject.toLowerCase().replace(/\s+/g, '-')}.json`)
    .then(res => res.json())
    .then(data => {
      titleElement.textContent = `${data.subject} Topics`;
      topicsContainer.innerHTML = '';

      data.topics.forEach((topic, index) => {
        const topicId = `topic-${index + 1}`;
        const iconId = `${topicId}-icon`;
        const panelId = `${topicId}-desc`;

        // Build subsections HTML
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

        // Append topic card
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
    })
    .catch(err => {
      titleElement.textContent = 'Failed to load subject content.';
      console.error('Error loading JSON:', err);
    });
});
