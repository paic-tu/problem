const CORS_PROXY = "https://api.allorigins.win/get?url=";
const CODEFORCES_API = "https://codeforces.com/api/problemset.problems";

async function fetchProblems() {
    try {
        const response = await fetch(CORS_PROXY + encodeURIComponent(CODEFORCES_API));
        const data = await response.json();
        const parsedData = JSON.parse(data.contents);

        if (parsedData.status === 'OK') {
            displayProblems(parsedData.result.problems);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function displayProblems(problems) {
    const container = document.getElementById('problems-container');
    container.innerHTML = problems.map(problem => `
        <div class="problem-card">
            <h5>${problem.contestId} - ${problem.index}: ${problem.name}</h5>
            <p>التصنيف: ${problem.tags.join(', ') || 'غير محدد'}</p>
            <a href="https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}" target="_blank" class="btn btn-primary">عرض على Codeforces</a>
        </div>
    `).join('');
}

window.onload = fetchProblems;