
let currentPage = 1;
const problemsPerPage = 10;

async function fetchProblems(page) {
    const container = document.getElementById('problems-container');
    container.innerHTML = '<div class="loading-indicator"></div>';

    try {
        const response = await fetch(CORS_PROXY + encodeURIComponent(CODEFORCES_API));
        const data = await response.json();
        const parsedData = JSON.parse(data.contents);

        if (parsedData.status === 'OK') {
            const problems = parsedData.result.problems;
            displayProblems(problems, page);
        } else {
            throw new Error('Failed to fetch problems from Codeforces API');
        }
    } catch (error) {
        console.error('Error:', error);
        container.innerHTML = '<p>حدث خطأ أثناء تحميل المسائل. حاول مرة أخرى لاحقًا.</p>';
    }
}

function displayProblems(problems, page) {
    const container = document.getElementById('problems-container');
    const startIndex = (page - 1) * problemsPerPage;
    const endIndex = page * problemsPerPage;
    const paginatedProblems = problems.slice(startIndex, endIndex);

    if (paginatedProblems.length > 0) {
        container.innerHTML = paginatedProblems.map(problem => `
            <div class="problem-card">
                <h5>${problem.contestId} - ${problem.index}: ${problem.name}</h5>
                <p>التصنيف: ${problem.tags.join(', ') || 'غير محدد'}</p>
                <a href="problem.html?contestId=${problem.contestId}&index=${problem.index}" class="btn btn-primary">عرض التفاصيل ورفع الكود</a>
            </div>
        `).join('');

        addPaginationControls(problems.length);
    } else {
        container.innerHTML = '<p>لا توجد مسائل متاحة في الوقت الحالي.</p>';
    }
}

function addPaginationControls(totalProblems) {
    const totalPages = Math.ceil(totalProblems / problemsPerPage);
    const paginationContainer = document.getElementById('pagination-controls');
    paginationContainer.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.classList.add('btn', 'btn-secondary', 'mx-1');
        if (i === currentPage) {
            pageButton.classList.add('btn-primary');
        }
        pageButton.addEventListener('click', () => {
            currentPage = i;
            fetchProblems(currentPage);
        });
        paginationContainer.appendChild(pageButton);
    }
}

window.onload = function() {
    fetchProblems(currentPage);
};
