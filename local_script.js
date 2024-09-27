
async function fetchLocalProblems() {
    const container = document.getElementById('problems-container');
    container.innerHTML = '<div class="loading-indicator"></div>'; // Display loading indicator

    try {
        console.log("Fetching problems from local file...");
        const response = await fetch('problems.json');
        if (!response.ok) {
            throw new Error(`HTTP Error! status: ${response.status}`);
        }

        const data = await response.json();
        const problems = data.result.problems;

        if (problems.length > 0) {
            container.innerHTML = problems.map(problem => `
                <div class="problem-card">
                    <h5>${problem.contestId} - ${problem.index}: ${problem.name}</h5>
                    <p>التصنيف: ${problem.tags.join(', ') || 'غير محدد'}</p>
                    <a href="problem_detail.html?index=${problem.index}" class="btn btn-primary">عرض التفاصيل ورفع الكود</a>
                </div>
            `).join('');
        } else {
            container.innerHTML = '<p>لا توجد مسائل متاحة في الوقت الحالي.</p>';
        }
    } catch (error) {
        console.error('Error fetching local problems:', error);
        container.innerHTML = '<p>حدث خطأ أثناء تحميل المسائل. حاول مرة أخرى لاحقًا.</p>';
    }
}

window.onload = fetchLocalProblems;
