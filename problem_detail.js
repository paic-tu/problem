
async function fetchProblemDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const problemIndex = urlParams.get('index');
    const container = document.getElementById('problem-description');

    try {
        console.log("Fetching problem details from local file...");
        const response = await fetch('problems.json');
        if (!response.ok) {
            throw new Error(`HTTP Error! status: ${response.status}`);
        }

        const data = await response.json();
        const problems = data.result.problems;
        const problem = problems.find(p => p.index === problemIndex);

        if (problem) {
            document.getElementById('problem-title').textContent = `المسألة ${problem.contestId}-${problem.index}: ${problem.name}`;
            container.textContent = problem.description || "لا يوجد وصف متاح لهذه المسألة.";
        } else {
            container.textContent = 'لم يتم العثور على تفاصيل لهذه المسألة.';
        }
    } catch (error) {
        console.error('Error fetching problem details:', error);
        container.innerHTML = '<p>حدث خطأ أثناء تحميل تفاصيل المسألة. حاول مرة أخرى لاحقًا.</p>';
    }
}

// Function to run user code and display the result
function runUserCode(event) {
    event.preventDefault();
    const code = document.getElementById('code').value;
    const outputContainer = document.getElementById('output');

    try {
        const result = eval(code); // WARNING: Do not use eval() in production for security reasons.
        outputContainer.textContent = result;
        document.getElementById('submission-status').textContent = "تم تنفيذ الكود بنجاح!";
    } catch (error) {
        outputContainer.textContent = error.message;
        document.getElementById('submission-status').textContent = "حدث خطأ أثناء تنفيذ الكود.";
    }
}

window.onload = function() {
    fetchProblemDetails();
    document.getElementById('submit-form').addEventListener('submit', runUserCode);
};
