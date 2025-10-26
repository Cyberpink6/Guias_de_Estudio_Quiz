document.addEventListener('DOMContentLoaded', function() {
    // Añadir interactividad a las opciones
    const options = document.querySelectorAll('.option');
    options.forEach(option => {
        option.addEventListener('click', function() {
            const checkbox = this.querySelector('input[type="checkbox"]');
            checkbox.checked = !checkbox.checked;
            
            if (checkbox.checked) {
                this.classList.add('selected');
            } else {
                this.classList.remove('selected');
            }
        });
    });
    
    // Manejar el envío del formulario
    document.getElementById('submit-btn').addEventListener('click', function() {
        evaluateQuiz();
    });
    
    // Manejar el botón de reinicio
    document.getElementById('restart-btn').addEventListener('click', function() {
        resetQuiz();
    });
    
    function evaluateQuiz() {
        const N = 5; // Número total de preguntas en el examen
        
        let totalScore = 0;
        let feedbackHTML = '';
        
        // Calcular puntuación para cada pregunta según tu sistema
        const questions = document.querySelectorAll('.question');
        
        questions.forEach((question, index) => {
            const questionNumber = index + 1;
            const options = question.querySelectorAll('.option');
            
            // Contar cuántas opciones correctas tiene la pregunta (C_i)
            let C_i = 0;
            options.forEach(option => {
                if (option.getAttribute('data-correct') === 'true') {
                    C_i++;
                }
            });
            
            // Contar respuestas correctas seleccionadas (A_i) e incorrectas seleccionadas (B_i)
            let A_i = 0; // Respuestas correctas marcadas
            let B_i = 0; // Respuestas incorrectas marcadas
            
            // Identificar opciones correctas e incorrectas para la retroalimentación
            let correctOptions = [];
            let incorrectOptions = [];
            
            options.forEach(option => {
                const isCorrect = option.getAttribute('data-correct') === 'true';
                const isSelected = option.querySelector('input').checked;
                const optionText = option.querySelector('label').textContent;
                
                if (isCorrect) {
                    correctOptions.push(optionText);
                    if (isSelected) {
                        A_i++;
                    }
                } else {
                    incorrectOptions.push(optionText);
                    if (isSelected) {
                        B_i++;
                    }
                }
            });
            
            // Calcular puntuación de la pregunta usando tu fórmula: (5/(N*C_i)) * (A_i - B_i)
            const questionScore = (5 / (N * C_i)) * (A_i - B_i);
            totalScore += questionScore;
            
            // Generar retroalimentación para esta pregunta
            feedbackHTML += `<div class="explanation">
                <p><strong>Pregunta ${questionNumber}:</strong></p>
                <p>Respuestas correctas seleccionadas: ${A_i} de ${C_i}</p>
                <p>Respuestas incorrectas seleccionadas: ${B_i}</p>
                <p class="correct-answer">Puntuación parcial: ${(questionScore).toFixed(2)} puntos</p>
                
                <div class="correct-feedback">
                    <p><strong>Respuestas correctas:</strong></p>
                    <div class="answer-list">`;
            
            // Mostrar las respuestas correctas
            correctOptions.forEach(option => {
                feedbackHTML += `<div class="answer-item">✓ ${option}</div>`;
            });
            
            feedbackHTML += `</div></div>`;
            
            // Mostrar las respuestas incorrectas si hay alguna seleccionada
            if (B_i > 0) {
                feedbackHTML += `<div class="incorrect-feedback">
                    <p><strong>Respuestas incorrectas seleccionadas:</strong></p>
                    <div class="answer-list">`;
                
                options.forEach(option => {
                    const isCorrect = option.getAttribute('data-correct') === 'true';
                    const isSelected = option.querySelector('input').checked;
                    const optionText = option.querySelector('label').textContent;
                    
                    if (!isCorrect && isSelected) {
                        feedbackHTML += `<div class="answer-item">✗ ${optionText}</div>`;
                    }
                });
                
                feedbackHTML += `</div></div>`;
            }
            
            // Mostrar respuestas correctas no seleccionadas si hay alguna
            let missedCorrect = false;
            options.forEach(option => {
                const isCorrect = option.getAttribute('data-correct') === 'true';
                const isSelected = option.querySelector('input').checked;
                const optionText = option.querySelector('label').textContent;
                
                if (isCorrect && !isSelected) {
                    if (!missedCorrect) {
                        feedbackHTML += `<div class="incorrect-feedback">
                            <p><strong>Respuestas correctas no seleccionadas:</strong></p>
                            <div class="answer-list">`;
                        missedCorrect = true;
                    }
                    feedbackHTML += `<div class="answer-item">? ${optionText}</div>`;
                }
            });
            
            if (missedCorrect) {
                feedbackHTML += `</div></div>`;
            }
            
            feedbackHTML += `</div>`;
        });
        
        // Asegurar que la puntuación total no sea negativa
        totalScore = Math.max(0, totalScore);
        
        // Determinar la calificación final G según tu fórmula
        let finalGrade;
        if (totalScore <= 2.5) {
            finalGrade = 2; // Desaprobado
        } else if (totalScore <= 3.5) {
            finalGrade = 3; // Bien
        } else if (totalScore <= 4.5) {
            finalGrade = 4; // Muy Bien
        } else {
            finalGrade = 5; // Excelente
        }
        
        // Usando la fórmula con funciones indicadoras (equivalente a lo anterior)
        // finalGrade = 2 + (totalScore > 2.5) + (totalScore > 3.5) + (totalScore > 4.5);
        
        // Determinar descripción de la nota
        let gradeDescription = "";
        let gradeClass = "";
        switch(finalGrade) {
            case 2:
                gradeDescription = "Desaprobado";
                gradeClass = "grade-2";
                break;
            case 3:
                gradeDescription = "Bien";
                gradeClass = "grade-3";
                break;
            case 4:
                gradeDescription = "Muy Bien";
                gradeClass = "grade-4";
                break;
            case 5:
                gradeDescription = "Excelente";
                gradeClass = "grade-5";
                break;
        }
        
        // Mostrar resultados
        document.getElementById('score').textContent = `Puntuación: ${totalScore.toFixed(2)} | Nota Final: ${finalGrade}`;
        document.getElementById('score').className = `score ${gradeClass}`;
        document.getElementById('grade-description').textContent = gradeDescription;
        document.getElementById('grade-description').className = `grade-description ${gradeClass}`;
        document.getElementById('feedback-content').innerHTML = feedbackHTML;
        document.getElementById('result').style.display = 'block';
        
        // Desplazarse a los resultados
        document.getElementById('result').scrollIntoView({ behavior: 'smooth' });
    }
    
    function resetQuiz() {
        // Limpiar todas las selecciones
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Quitar clases de selección
        const options = document.querySelectorAll('.option');
        options.forEach(option => {
            option.classList.remove('selected');
            option.classList.remove('incorrect');
        });
        
        // Ocultar resultados
        document.getElementById('result').style.display = 'none';
        
        // Desplazarse al inicio
        window.scrollTo(0, 0);
    }
});