
const JUDGE0_API_URL = "https://judge0-ce.p.rapidapi.com/submissions";
const JUDGE0_API_HEADERS = {
    "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
    "x-rapidapi-key": "YOUR_RAPIDAPI_KEY_HERE", // استبدل هذه القيمة بمفتاحك من RapidAPI
    "content-type": "application/json"
};

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

// Function to run user code using Judge0 API
async function runUserCode(event) {
    event.preventDefault();
    const code = document.getElementById('code').value;
    const languageId = document.getElementById('language').value;
    const outputContainer = document.getElementById('output');

    if (!code) {
        outputContainer.textContent = "الرجاء إدخال الكود قبل الإرسال.";
        return;
    }

    try {
        document.getElementById('submission-status').textContent = "جاري تشغيل الكود...";
        outputContainer.textContent = "جاري التحميل...";

        // Prepare the request for Judge0 API
        const submissionData = {
            source_code: code,
            language_id: languageId,
            stdin: "" // لا توجد مدخلات افتراضية
        };

        const submissionResponse = await fetch(JUDGE0_API_URL, {
            method: "POST",
            headers: JUDGE0_API_HEADERS,
            body: JSON.stringify(submissionData)
        });

        if (!submissionResponse.ok) {
            throw new Error(`Submission Error! status: ${submissionResponse.status}`);
        }

        const { token } = await submissionResponse.json();
        const resultUrl = `${JUDGE0_API_URL}/${token}`;

        // Wait for the result
        let status = "جاري التنفيذ...";
        while (status === "جاري التنفيذ...") {
            const resultResponse = await fetch(resultUrl, { headers: JUDGE0_API_HEADERS });
            const resultData = await resultResponse.json();

            status = resultData.status.description;
            if (resultData.stdout || resultData.stderr) {
                outputContainer.textContent = resultData.stdout || resultData.stderr;
            } else {
                outputContainer.textContent = status;
            }

            if (resultData.status.id <= 2) {
                await new Promise(resolve => setTimeout(resolve, 1000)); // انتظار 1 ثانية
            } else {
                break;
            }
        }

        document.getElementById('submission-status').textContent = `تم تنفيذ الكود: ${status}`;
    } catch (error) {
        console.error('Error running code:', error);
        document.getElementById('submission-status').textContent = "حدث خطأ أثناء تشغيل الكود.";
        outputContainer.textContent = error.message;
    }
}

window.onload = function() {
    fetchProblemDetails();
    document.getElementById('submit-form').addEventListener('submit', runUserCode);
};
