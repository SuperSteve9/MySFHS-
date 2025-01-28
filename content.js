const nums = [];
const classes = [];

const newgrades = [];

const grades = []; // this will store grades temporarily

// thing to get the letter grade cause thats important cause oncampus+ used it so i gotta
// I also forgot the grading scale for - and + used in oc+ so im just gonna have to guess
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

function arraysAreEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    return arr1.every((val, index) => val === arr2[index]);
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

function appendToGrades() {
    document.querySelectorAll('#app #coursesContainer .row').forEach(row => {
        var classname = row.querySelector('.col-md-3 a h3').textContent;
        classes.push(classname);
        var gradeElem = row.querySelector('.col-md-2 h3.showGrade');
        var weightedElem = row.querySelector('.col-md-3 a');

        if (gradeElem && !gradeElem.dataset.modified) { // Prevent cloning
            if (!gradeElem.textContent || gradeElem.textContent.trim() === "--") {
                nums.push(0);
                newgrades.push(0);
                return;  // still water balkan rage german stare GET OUT OF MY HEAD
            }
            // get the letter grade
            var grade = parseFloat(gradeElem.textContent);
            nums.push(grade);
            newgrades.push(grade);

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

// this is gonna be the grade changes
function createGradeChangeThing() {
    localStorage.setItem('grades', JSON.stringify(nums));

    const savedNums = JSON.parse(localStorage.getItem('grades'));
    var conductDiv = document.getElementById('conduct');
    if (conductDiv && !document.getElementById('GradeChange')) { // Prevent LOW TAPER FADE bots
        var clonedDiv = conductDiv.cloneNode(true);
        clonedDiv.id = 'GradeChange';
        var title = clonedDiv.querySelector('h2.bb-tile-header');
        if (title) {
            title.textContent = 'Grade Changes';
        }
        var desc = clonedDiv.querySelector('h5');
        if (desc) {
            desc.textContent = 'No grade changes since last time you checked.';
        }
        $(clonedDiv).find(".col-md-12 div a h1").wrap('<h5></h5>').parent().contents().unwrap();
        $(clonedDiv).find(".col-md-12 div a h1").remove();

        var gpaContainer = clonedDiv.querySelector('.col-md-12'); // Adjust this selector if needed
        if (gpaContainer) {
            // Clear the container for new content
            gpaContainer.innerHTML = '';

            // Array of class grades
            var classGrades = [];
            classGrades.length = savedNums.length;
            savedNums.forEach(grade => classGrades.push(grade));

            var toDisplay = [];

            for (index = 0; index < savedNums.length; index++) {
                if (newgrades[index] > savedNums[index]) {
                    toDisplay[index] = (classes[index] + ': ' + savedNums[index] + ' ↑ ' + newgrades[index]);
                } else if (newgrades[index] < savedNums[index]) {
                    toDisplay[index] = (classes[index] + ': ' + savedNums[index] + ' ↓ ' + newgrades[index]);
                } else {
                    toDisplay[index] = 0;
                }
            }

            if (toDisplay.every(grade => grade === 0)) {
                var gradeElement = document.createElement('h5');
                gradeElement.textContent = 'No grade changes.';
                gpaContainer.appendChild(gradeElement);
            }
            

            if (toDisplay.length == 9) {
                toDisplay.forEach(function (grade, index) {
                    if (toDisplay[index] == 0) {
                        return;
                    }
                    var gradeElement = document.createElement('h5');
                    gradeElement.textContent = grade;
                    gpaContainer.appendChild(gradeElement);
                });
            }
        }
        var targetDiv = clonedDiv.querySelector('.bb-tile-title');
        if (targetDiv) {
            targetDiv.setAttribute('data-target', '#GradeCollapse');
        }

        var afdiv = clonedDiv.querySelector('#conductCollapse');
        if (afdiv) {
            afdiv.setAttribute('id', 'GradeCollapse');
        }
        conductDiv.parentNode.appendChild(clonedDiv);
    }
}

function observeURLChanges() {
    let lastUrl = location.href;
    new MutationObserver(() => {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            setTimeout(() => {
                appendToGrades();
                createGPAThing();
                createGradeChangeThing();
            }, 1500);
        }
    }).observe(document.body, { childList: true, subtree: true });
}

(function() {
    // wait a second cause blackbaud is a bitch
    setTimeout(() => {
        appendToGrades();
        createGPAThing();
        createGradeChangeThing();
        observeURLChanges();
    }, 1500);
})();
