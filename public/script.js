// Function to generate a pastel light blue color with reduced opacity
function getPastelLightBlueColor() {
    const baseColor = '173, 216, 230'; // RGB values for light blue
    const opacity = 0.45; // Set opacity to 45%
    return `rgba(${baseColor}, ${opacity})`;
}

document.addEventListener('DOMContentLoaded', function () {
    const optionButtons = document.querySelectorAll('.option-button');

    // Create an object to track the selected option for each question
    const selectedOptions = {};

    optionButtons.forEach(function (button) {
        button.style.backgroundColor = getPastelLightBlueColor();

        button.addEventListener('click', function () {
            const questionId = button.getAttribute('data-question-id');

            // Reset color for the previously selected option in the same question
            if (selectedOptions[questionId]) {
                selectedOptions[questionId].style.backgroundColor = getPastelLightBlueColor();
            }

            // Update the selected option for the current question
            selectedOptions[questionId] = button;
            button.style.backgroundColor = 'rgba(255, 182, 193, 0.45)'; // Light red color
        });
    });
});
