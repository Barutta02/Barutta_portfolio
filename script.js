function showSkills(category) {
    var selectedCard = document.querySelector('.' + category);
    // Sposta la carta selezionata in cima alla lista
    var skillsContainer = document.getElementById('skillsContainer');
    skillsContainer.prepend(selectedCard);
    // Scorri fino alla carta selezionata
    selectedCard.scrollIntoView({ behavior: 'smooth', block: 'start' });

}