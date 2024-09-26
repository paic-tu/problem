<?php
// الاتصال بقاعدة البيانات (تأكد من استخدام بيانات الاتصال الصحيحة)
$host = 'localhost';
$dbname = 'problem_db';
$username = 'root';
$password = '';

$conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);

// التحقق من طلب رفع المسألة
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $title = $_POST['problem_title'];
    $description = $_POST['problem_description'];
    $category = $_POST['problem_category'];
    $difficulty = $_POST['problem_difficulty'];

    // SQL لإدخال المسألة في قاعدة البيانات
    $sql = "INSERT INTO problems (title, description, category, difficulty) 
            VALUES (:title, :description, :category, :difficulty)";
    $stmt = $conn->prepare($sql);
    $stmt->execute([
        ':title' => $title,
        ':description' => $description,
        ':category' => $category,
        ':difficulty' => $difficulty
    ]);

    // رسالة تأكيد
    echo "تم رفع المسألة بنجاح!";
}
?>
