import { questions } from '../questions/questions.js';

document.addEventListener('DOMContentLoaded', () => {
    let currentQuestion;
    let usedQuestionIds = [];
    let correctAnswers = 0;
    let totalAnswered = 0;

    // Référence à l'écran d'accueil et à la section du quiz
    const welcomeSection = document.getElementById('welcome-section');
    const quizSection = document.getElementById('quiz-section');

    // Gestionnaire pour le bouton de démarrage
    document.getElementById('start-button').addEventListener('click', () => {
        welcomeSection.style.display = 'none';
        quizSection.style.display = 'flex'; // Utiliser flex au lieu de block
        // Initialiser le quiz
        loadNextQuestion();
    });

    function getRandomQuestion() {
        const availableQuestions = questions.filter(question => !usedQuestionIds.includes(question.id));
        if (availableQuestions.length === 0) { return null; }
        return availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    }

    function changeBackground(type, questionId = null) {
        const container = document.querySelector('.container');
        if (type === 'good' && questionId) {
            container.style.backgroundImage = `url('../resources/answers/${questionId}_good.png')`;
        } else if (type === 'bad' && questionId) {
            container.style.backgroundImage = `url('../resources/answers/${questionId}_bad.png')`;
        } else {
            container.style.backgroundImage = "url('../resources/base_background.png')";
        }
    }

    function displayQuestion(question) {
        currentQuestion = question;

        // Remise à l'arrière-plan par défaut pour chaque nouvelle question
        changeBackground('default');

        // Mise à jour de la question
        document.getElementById('question').textContent = question.question;

        // Mélanger les options (copie et mélange)
        const shuffledOptions = [...question.options];
        for (let i = shuffledOptions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
        }

        // Mise à jour des options
        const optionsContainer = document.getElementById('options');
        optionsContainer.innerHTML = '';

        shuffledOptions.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option;
            button.classList.add('option-button');
            button.addEventListener('click', () => checkAnswer(option));
            optionsContainer.appendChild(button);
        });

        // Cache l'explication
        document.getElementById('explanation').textContent = '';
        document.getElementById('explanation-container').style.display = 'none';
        document.getElementById('next-button').style.display = 'none';

        usedQuestionIds.push(question.id);
    }

    function checkAnswer(selectedOption) {
        totalAnswered++;
        const isCorrect = selectedOption === currentQuestion.correctAnswer;

        if (isCorrect) {
            correctAnswers++; // Incrémentation du compteur de bonnes réponses
            changeBackground('good', currentQuestion.id);
        } else {
            changeBackground('bad', currentQuestion.id);
        }

        const optionButtons = document.querySelectorAll('.option-button');
        // Désactive tous les boutons
        optionButtons.forEach(button => {
            button.disabled = true;

            // Colore le bouton sélectionné
            if (button.textContent === selectedOption) {
                button.classList.add(isCorrect ? 'option-correct' : 'option-incorrect');
            }

            // Indique la bonne réponse si l'utilisateur s'est trompé
            if (!isCorrect && button.textContent === currentQuestion.correctAnswer) {
                button.classList.add('option-correct');
            }
        });

        // Affiche l'explication
        document.getElementById('explanation').textContent = currentQuestion.explanation;
        document.getElementById('explanation-container').style.display = 'flex';
        document.getElementById('next-button').style.display = 'block';
    }

    function showFinalScore() {
        // Nettoyer l'interface
        document.getElementById('question').textContent = "Bravo vous avez répondu à toutes les questions !";
        document.getElementById('options').innerHTML = '';

        // Utiliser toujours l'arrière-plan par défaut
        changeBackground('default');

        // Afficher le score dans la zone d'explication
        document.getElementById('explanation').textContent = `Votre score : ${correctAnswers} / ${totalAnswered}`;
        document.getElementById('explanation-container').style.display = 'flex';
        document.getElementById('next-button').style.display = 'none';
    }

    function loadNextQuestion() {
        const nextQuestion = getRandomQuestion();

        if (nextQuestion) {
            displayQuestion(nextQuestion);
        } else {
            showFinalScore();
        }
    }

    // Initialisation du bouton "question suivante"
    document.getElementById('next-button').addEventListener('click', loadNextQuestion);
});