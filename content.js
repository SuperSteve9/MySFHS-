const grades = [];
// thing to get the letter grade cause thats important cause oncampus+ used it so i gotta
// I also forgot the grading scale for - and + used there so im just gonna have to guess
// also who tf getting less than a 70 in a class :skull:
function getGradeLetter(grade) {
    switch (true) {
        case (grade >= 97):
            return 'A+';
        case (grade >= 95):
            return 'A';
        case (grade >= 93):
            return 'A-';
        case (grade >= 90):
            return 'B+';
        case (grade >= 87):
            return 'B';
        case (grade >= 85):
            return 'B-';
        case (grade >= 83):
            return 'C+';
        case (grade >= 79):
            return 'C';
        case (grade >= 76):
            return 'C-';
        case (grade >= 74):
            return 'D+';
        case (grade >= 72):
            return 'D';        
        case (grade >= 70):
            return 'D-';
        default:
            return 'F';
    }
}

// calculate GPA per class
// bro tf is this GPA calculation maybe idk but this seems kinda stupid
function calcGPA(grade, Weighted) {
    var gpa;
    if (grade >= 70 && grade < 76) {
        // point in value bracket kinda like taxes but for grades
        var piv = grade - 70;
        gpa = (((2.00 - 1.00) / 6) * piv) + 1.00;
    } else if (grade >= 76 && grade < 85) {
        var piv = grade - 76;
        gpa = (((3.00 - 2.00) / 9) * piv) + 2.00;
    } else if (grade >= 85 && grade < 93) {
        var piv = grade - 85;
        gpa = (((4.00 - 3.00) / 8) * piv) + 3.00;
    } else if (grade >= 93) {
        var piv = grade - 93;
        gpa = (((4.86 - 4.00) / 7) * piv) + 4.00;
    }

    if (Weighted) {
        gpa += 1;
    }

    return gpa;
}

// calculate cumulative GPA
// i don't even know how this works if im even doing it correctly but i guess ill see
function calcCumGPA(grades) {
    var count = grades.length;
    var total = 0;
    for (i=0; i<grades.length; i++) {
        total += grades[i];
    }

    var cumGPA = total / count;
    return cumGPA;
}

(function() {
    function appendToGrades() {
        document.querySelectorAll('#app #coursesContainer .row').forEach(row => {
            var gradeElem = row.querySelector('.col-md-2 h3.showGrade');
            var weightedElem = row.querySelector('.col-md-3 a');

            if (gradeElem && !gradeElem.dataset.modified) { // Prevent cloning
                if (!gradeElem.textContent || gradeElem.textContent.trim() === "--") {
                    return;  // still water balkan rage german stare GET OUT OF MY HEAD
                }
                // get the letter grade
                var grade = parseFloat(gradeElem.textContent);

                // GPA calculation with weights :)
                if (weightedElem) {
                    var classID = weightedElem.getAttribute('href');
                    classID = classID.replace('#academicclass/', '');
                    classID = classID.replace('/undefined/bulletinboard', '');
                    if (classID.substring(0, 3) == '976') {
                        var gpa = calcGPA(grade, true);
                        grades.push(gpa);
                    } else if (classID.substring(0, 3) == '977') {
                        var gpa = calcGPA(grade, false);
                        grades.push(gpa);
                    }
                }

                var letter = getGradeLetter(grade);
                // append that thang
                gradeElem.textContent += (' (' + letter + ')');
                gradeElem.dataset.modified = 'true';

            }
        });
    }

    // this shit is a pain to do but is actually kinda cool that it worked lmao
    function createGPAThing() {
        var conductDiv = document.getElementById('conduct');
        if (conductDiv && !document.getElementById('GPA')) { // Prevent LOW TAPER FADE bots
            var clonedDiv = conductDiv.cloneNode(true);
            clonedDiv.id = 'GPA';
            var title = clonedDiv.querySelector('h2.bb-tile-header');
            if (title) {
                title.textContent = 'GPA';
            }
            var desc = clonedDiv.querySelector('h5');
            if (desc) {
                desc.textContent = 'Current Weighted GPA';
            }
            $(clonedDiv).find(".col-md-12 div a h1").unwrap();
            var GPA = clonedDiv.querySelector('.col-md-12 h1');
            if (GPA) {
                GPA.textContent = calcCumGPA(grades).toFixed(2);
            }

            var targetDiv = clonedDiv.querySelector('.bb-tile-title');
            if (targetDiv) {
                targetDiv.setAttribute('data-target', '#GPACollapse');
            }

            var afdiv = clonedDiv.querySelector('#conductCollapse');
            if (afdiv) {
                afdiv.setAttribute('id', 'GPACollapse');
            }
            conductDiv.parentNode.appendChild(clonedDiv);
        }
    }

    // wait a second cause blackbaud is a bitch
    setTimeout(() => {
        appendToGrades();
        createGPAThing();
    }, 2000);

    // those who know!!! :skull:
    // also i have no fucking idea how this works I had to ask gpt but it does so yipee
    // also fuck AJAX loading i know its good and all but like bro the shade is crazy
    const observer = new MutationObserver(() => {
        appendToGrades();
        createGPAThing();
    });
    const target = document.querySelector('#coursesContainer');
    if (target) {
        observer.observe(target, { childList: true, subtree: true });
    }
})();
