//Use a class to construct question objects in order to avoid repeating all the inner HTML.
//Use an array to store question objects. When the Start button is clicked and each time a question is submitted, use a random number to select another question from the array, then remove that question from the array.
//Each question object contains properties for the question and answer choices, as well as inner HTML that includes class attributes.
//Dynamically create and add elements using the stored properties of the question objects.
//For the timer, use minute and second variables. Update the display every second and calculate the variables based on a single time remaining variable that decrements every second.
//For the scores, remember localStorage.setItem("Key", "Value") and localStorage.getItem("Key"). preventDefault() the Submit button for the initials associated with the score.