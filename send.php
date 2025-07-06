


<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name     = strip_tags(trim($_POST["name"]));
    $number   = strip_tags(trim($_POST["number"]));
    $location = strip_tags(trim($_POST["location"]));
    $message  = trim($_POST["message"]);

    // Validate input
    if (empty($name) || empty($number) || empty($location) || empty($message)) {
        http_response_code(400);
        echo "Please fill in all fields and try again.";
        exit;
    }

    // Email content
    $recipient = "info@ac.wtec1.xyz";
    $subject   = "New LMS Order from $name";
    $content   = "Name: $name\n";
    $content  .= "Phone Number: $number\n";
    $content  .= "Location: $location\n";
    $content  .= "Message:\n$message\n";

    $headers   = "From: noreply@ac.wtec1.com";

    // Send email
    if (mail($recipient, $subject, $content, $headers)) {
        http_response_code(200);
        echo "Order sent successfully!";
    } else {
        http_response_code(500);
        echo "Something went wrong. Please try again later.";
    }
} else {
    http_response_code(403);
    echo "Invalid request method.";
}
?>
