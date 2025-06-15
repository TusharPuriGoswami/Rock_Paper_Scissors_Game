document.addEventListener('DOMContentLoaded', () => {
    // Game elements
    const welcomeScreen = document.getElementById('welcomeScreen');
    const gameScreen = document.getElementById('gameScreen');
    const startGameBtn = document.getElementById('startGame');
    const playAgainBtn = document.getElementById('playAgain');
    const resetGameBtn = document.getElementById('resetGame');
    
    const playerNameInput = document.getElementById('playerName');
    const playerNameDisplay = document.getElementById('playerNameDisplay');
    const playerNameChoice = document.getElementById('playerNameChoice');
    const playerScoreDisplay = document.getElementById('playerScore').querySelector('span');
    const computerScoreDisplay = document.getElementById('computerScore').querySelector('span');

    const statusMessage = document.getElementById('statusMessage');
    const choices = document.querySelectorAll('.choice');
    const playerChoiceDisplay = document.getElementById('playerChoice');
    const computerChoiceDisplay = document.getElementById('computerChoice');
    const resultMessage = document.getElementById('resultMessage');
    const resultText = document.querySelector('.result-text');
    const resultDetails = document.getElementById('resultDetails');

    // Game state
    let playerName = 'You';
    let playerScore = 0;
    let computerScore = 0;
    let gameActive = false;
    let roundCount = 0;
    
    // Event listeners
    startGameBtn.addEventListener('click', startGame);
    playAgainBtn.addEventListener('click', playAgain);
    resetGameBtn.addEventListener('click', resetGame);
    
    choices.forEach(choice => {
        choice.addEventListener('click', () => {
            if (!gameActive) return;
            
            // Remove selected class from all choices
            choices.forEach(c => c.classList.remove('selected'));

            // Add selected class to clicked choice
            choice.classList.add('selected');

            const playerChoice = choice.getAttribute('data-choice');
            playRound(playerChoice);
        });
    });
    
    // Game functions
    function startGame() {
        // Get player name (use default if empty)
        playerName = playerNameInput.value.trim() || 'You';

        // Update display with player name
        playerNameDisplay.textContent = playerName;
        playerNameChoice.textContent = playerName;

        // Reset game state
        playerScore = 0;
        computerScore = 0;
        playerScoreDisplay.textContent = '0';
        computerScoreDisplay.textContent = '0';
        roundCount = 0;
        
        // Switch to game screen
        welcomeScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        
        // Start first round
        playAgain();
    }
    
    function playAgain() {
        // Reset displays
        playerChoiceDisplay.querySelector('.choice-icon i').className = 'fas fa-question';
        computerChoiceDisplay.querySelector('.choice-icon i').className = 'fas fa-question';

        // Remove any highlight classes
        playerChoiceDisplay.querySelector('.choice-icon').classList.remove('win', 'lose', 'tie');
        computerChoiceDisplay.querySelector('.choice-icon').classList.remove('win', 'lose', 'tie');

        // Reset result message with animation
        resultMessage.classList.remove('reveal');
        void resultMessage.offsetWidth; // Force reflow to restart animation
        resultMessage.classList.add('reveal');

        // Update status and result messages
        statusMessage.textContent = 'Choose your move!';
        statusMessage.className = 'status-message player-turn';
        resultText.textContent = 'Make your selection to start';
        resultDetails.textContent = '';
        resultMessage.className = 'result-message';

        // Remove selected class from all choices
        choices.forEach(choice => choice.classList.remove('selected'));

        // Increment round count
        roundCount++;

        // Activate game
        gameActive = true;
    }

    function resetGame() {
        // Go back to welcome screen
        gameScreen.classList.add('hidden');
        welcomeScreen.classList.remove('hidden');

        // Clear input field
        playerNameInput.value = '';

        // Reset game state
        gameActive = false;
        roundCount = 0;
    }

    function playRound(playerChoice) {
        // Deactivate game until animation is complete
        gameActive = false;

        // Update player choice display
        updateChoiceDisplay(playerChoiceDisplay, playerChoice);

        // Update status message with animation
        statusMessage.classList.remove('reveal');
        void statusMessage.offsetWidth; // Force reflow to restart animation
        statusMessage.classList.add('reveal');
        statusMessage.textContent = "Computer is choosing...";
        statusMessage.className = 'status-message computer-turn';

        // Add thinking animation to computer choice
        computerChoiceDisplay.querySelector('.choice-icon').classList.add('thinking');

        // Simulate computer "thinking"
        setTimeout(() => {
            // Remove thinking animation
            computerChoiceDisplay.querySelector('.choice-icon').classList.remove('thinking');

            // Generate computer choice
            const choices = ['rock', 'paper', 'scissors'];
            const computerChoice = choices[Math.floor(Math.random() * choices.length)];

            // Update computer choice display
            updateChoiceDisplay(computerChoiceDisplay, computerChoice);

            // Determine winner - FIXED: Now calculating result before using it
                const result = determineWinner(playerChoice, computerChoice);

            // Show battle results with a slight delay for better user experience
            setTimeout(() => {
                // Update status message with animation
                statusMessage.classList.remove('reveal');
                void statusMessage.offsetWidth; // Force reflow to restart animation
                statusMessage.classList.add('reveal');
                statusMessage.textContent = "Round complete!";
                statusMessage.className = 'status-message';

                // Show result
                showResult(result, playerChoice, computerChoice);

            }, 300);

        }, 1000); // 1 second delay for computer "thinking"
    }

    function updateChoiceDisplay(displayElement, choice) {
        const iconElement = displayElement.querySelector('.choice-icon i');

        if (choice === 'rock') {
            iconElement.className = 'fas fa-hand-rock';
        } else if (choice === 'paper') {
            iconElement.className = 'fas fa-hand-paper';
        } else if (choice === 'scissors') {
            iconElement.className = 'fas fa-hand-scissors';
        }
    }

    function determineWinner(playerChoice, computerChoice) {
        if (playerChoice === computerChoice) {
            return 'tie';
        }

        if (
            (playerChoice === 'rock' && computerChoice === 'scissors') ||
            (playerChoice === 'paper' && computerChoice === 'rock') ||
            (playerChoice === 'scissors' && computerChoice === 'paper')
        ) {
            return 'win';
        } else {
            return 'lose';
        }
    }

    function showResult(result, playerChoice, computerChoice) {
        // Apply reveal animation to result message
        resultMessage.classList.remove('reveal');
        void resultMessage.offsetWidth; // Force reflow to restart animation
        resultMessage.classList.add('reveal');

        // Format choices for display
        const formattedPlayerChoice = playerChoice.charAt(0).toUpperCase() + playerChoice.slice(1);
        const formattedComputerChoice = computerChoice.charAt(0).toUpperCase() + computerChoice.slice(1);

        // Prepare explanatory text
        let explanationText = '';

        if (result === 'win') {
            playerScore++;
            playerScoreDisplay.textContent = playerScore;
            resultText.textContent = `${playerName} wins this round!`;
            resultMessage.className = 'result-message win';

            // Add win/lose indicators to choice icons
            playerChoiceDisplay.querySelector('.choice-icon').classList.add('win');
            computerChoiceDisplay.querySelector('.choice-icon').classList.add('lose');

            // Explanation
            explanationText = getExplanationText(playerChoice, computerChoice, true);
        } else if (result === 'lose') {
            computerScore++;
            computerScoreDisplay.textContent = computerScore;
            resultText.textContent = `Computer wins this round!`;
            resultMessage.className = 'result-message lose';

            // Add win/lose indicators to choice icons
            playerChoiceDisplay.querySelector('.choice-icon').classList.add('lose');
            computerChoiceDisplay.querySelector('.choice-icon').classList.add('win');

            // Explanation
            explanationText = getExplanationText(computerChoice, playerChoice, false);
        } else {
            resultText.textContent = "It's a tie!";
            resultMessage.className = 'result-message tie';

            // Add tie indicators to choice icons
            playerChoiceDisplay.querySelector('.choice-icon').classList.add('tie');
            computerChoiceDisplay.querySelector('.choice-icon').classList.add('tie');

            // Explanation
            explanationText = `Both chose ${formattedPlayerChoice}!`;
        }

        // Update result details
        resultDetails.textContent = explanationText;
    }

    function getExplanationText(winningChoice, losingChoice, playerWon) {
        const winner = playerWon ? playerName : 'Computer';

        if (winningChoice === 'rock' && losingChoice === 'scissors') {
            return `${winner}'s Rock crushes Scissors!`;
        } else if (winningChoice === 'paper' && losingChoice === 'rock') {
            return `${winner}'s Paper covers Rock!`;
        } else if (winningChoice === 'scissors' && losingChoice === 'paper') {
            return `${winner}'s Scissors cut Paper!`;
        }

        return ''; // Fallback
    }
});