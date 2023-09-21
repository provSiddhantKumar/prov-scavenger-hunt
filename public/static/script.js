const passcodeForm = document.getElementById("passcodeForm");
const passcode = document.getElementById("passcode");
const errorMsg = document.getElementById("errorMsg");
const inputArea = document.getElementById("inputArea");
const riddleArea = document.getElementById("riddleArea");

inputArea.style.display = "block"; // Display the input area by default

passcodeForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const teamId = window.location.pathname.split('/')[1];
    const riddleId = window.location.pathname.split('/')[3];

    fetch(`/${teamId}/riddle/${riddleId}/validate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `passcode=${passcode.value}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            inputArea.style.display = "none";
            riddleArea.innerHTML = `<p>Correct! Proceed to the next location.</p>`; // You can customize this message
            riddleArea.style.display = "block";
        } else {
            passcode.style.animation = "shake 0.5s";
            errorMsg.textContent = data.message || "An error occurred. Try again!";
        }
    })
    .catch(error => console.error('Error:', error));
});

// Resetting animation for consecutive shakes
passcode.addEventListener('animationend', () => {
    passcode.style.animation = '';
});
