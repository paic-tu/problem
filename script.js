
const CORS_PROXY = "https://api.allorigins.win/get?url=";
const CODEFORCES_API = "https://codeforces.com/api/problemset.problems";

async function fetchProblems() {
    try {
        document.getElementById('problems-container').innerHTML = '<p>جاري تحميل المسائل...</p>';
        
        const response = await fetch(CORS_PROXY + encodeURIComponent(CODEFORCES_API));
        const data = await response.json();
        const parsedData = JSON.parse(data.contents);

        if (parsedData.status === 'OK') {
            displayProblems(parsedData.result.problems);
        } else {
            throw new Error('Failed to fetch problems from Codeforces API');
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('problems-container').innerHTML = '<p>حدث خطأ أثناء تحميل المسائل. حاول مرة أخرى لاحقًا.</p>';
    }
}

function displayProblems(problems) {
    const container = document.getElementById('problems-container');
    if (problems.length > 0) {
        container.innerHTML = problems.map(problem => `
            <div class="problem-card">
                <h5>${problem.contestId} - ${problem.index}: ${problem.name}</h5>
                <p>التصنيف: ${problem.tags.join(', ') || 'غير محدد'}</p>
                <a href="problem.html?contestId=${problem.contestId}&index=${problem.index}" class="btn btn-primary">عرض التفاصيل ورفع الكود</a>
            </div>
        `).join('');
    } else {
        container.innerHTML = '<p>لا توجد مسائل متاحة في الوقت الحالي.</p>';
    }
}

window.onload = fetchProblems;
