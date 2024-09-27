
// Interactive JavaScript content for dynamic loading
document.addEventListener("DOMContentLoaded", function () {
    console.log("Interactive elements initialized...");

    // Function to load problems from problems.json
    function loadProblems() {
        fetch('data/problems.json')
            .then(response => response.json())
            .then(data => {
                const problemsContainer = document.getElementById('problems-container');
                let problemsHTML = "";
                data.result.problems.forEach(problem => {
                    problemsHTML += `
                        <div class="card problem-card shadow-lg mb-4" data-aos="fade-up">
                            <div class="card-body">
                                <h5 class="card-title">${problem.index} - ${problem.name}</h5>
                                <p class="card-text">التصنيف: ${problem.tags.join(', ')}</p>
                                <button class="btn btn-primary">عرض المسألة</button>
                            </div>
                        </div>
                    `;
                });
                problemsContainer.innerHTML = problemsHTML;
            })
            .catch(error => console.error("Error loading problems:", error));
    }

    // Load problems dynamically
    if (document.getElementById('problems-container')) {
        loadProblems();
    }
});
