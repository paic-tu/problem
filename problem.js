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
