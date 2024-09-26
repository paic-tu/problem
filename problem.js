
const CORS_PROXY = "https://api.allorigins.win/get?url=";
const CODEFORCES_API = "https://codeforces.com/api/problemset.problem";
const SUBMIT_API = "https://codeforces.com/api/contest.submit";

const API_KEY = "33fe254b8de5c8e0d4cce378273a9b5faa7f8b1f";
const SECRET = "9da2871275fa58bb040ba9dd16aec9449056cab6";

async function getProblemDetails(contestId, index) {
    try {
        const apiUrl = `${CODEFORCES_API}?contestId=${contestId}&index=${index}`;
        console.log("API URL:", apiUrl); // تحقق من الرابط

        const response = await fetch(CORS_PROXY + encodeURIComponent(apiUrl));
        const data = await response.json();
        const parsedData = JSON.parse(data.contents);

        if (parsedData.status === 'OK') {
            const problem = parsedData.result;
            document.getElementById('problem-title').textContent = `المسألة ${problem.contestId}-${problem.index}: ${problem.name}`;
            document.getElementById('problem-description').textContent = problem.statement || "لا يوجد وصف للمسألة";
        } else {
            document.getElementById('problem-description').textContent = 'حدث خطأ أثناء جلب تفاصيل المسألة.';
        }
    } catch (error) {
        console.error('Error fetching problem details:', error);
        document.getElementById('problem-description').textContent = 'حدث خطأ أثناء جلب تفاصيل المسألة.';
    }
}

async function submitCode(event) {
    event.preventDefault();
    const code = document.getElementById('code').value;
    const urlParams = new URLSearchParams(window.location.search);
    const contestId = urlParams.get('contestId');
    const index = urlParams.get('index');
    
    if (!code) {
        alert("الرجاء إدخال الكود قبل الإرسال.");
        return;
    }

    try {
        const response = await fetch(SUBMIT_API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contestId: contestId,
                index: index,
                source: code,
                language: "54", 
                apiKey: API_KEY,
                secret: SECRET
            })
        });
        const result = await response.json();
        if (result.status === "OK") {
            document.getElementById('submission-status').textContent = "تم رفع الكود بنجاح!";
        } else {
            document.getElementById('submission-status').textContent = "حدث خطأ أثناء رفع الكود.";
        }
    } catch (error) {
        console.error('Error submitting code:', error);
        document.getElementById('submission-status').textContent = "حدث خطأ أثناء رفع الكود.";
    }
}

window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const contestId = urlParams.get('contestId');
    const index = urlParams.get('index');
    getProblemDetails(contestId, index);

    document.getElementById('submit-form').addEventListener('submit', submitCode);
};
