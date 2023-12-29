document.addEventListener('DOMContentLoaded', () => {
    const dashboard = document.getElementById('dashboard');
    const addCardButton = document.getElementById('addCardButton');

    // Fetch data from Lorem Picsum API
    const apiUrl = 'https://picsum.photos/v2/list?page=2&limit=7';

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Process the data and populate cards dynamically
            data.forEach(item => {
                const card = createCard(item);
                dashboard.appendChild(card);
            });
        })
        .catch(error => {
            // Handle errors gracefully
            console.error('Error fetching data:', error);
        });

    // Create card element
    function createCard(item) {
        const card = document.createElement('div');
        card.className = 'card';
        card.id = `card${item.id}`;
        card.innerHTML = `
            <img src="${item.download_url}" alt="Random Image">
            <p>${item.author}</p>
            <button class="editButton" data-card-id="${item.id}">Edit</button>
            <button class="deleteButton" data-card-id="${item.id}">Delete</button>
        `;

        // Event listener for viewing details of each card
        card.addEventListener('click', () => showCardDetails(item));

        return card;
    }

    // Create modal for card details
    function createModal(item) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <p>${item.author}</p>
                <img src="${item.download_url}" alt="Random Image">
                <button class="editButton" data-card-id="${item.id}">Edit</button>
                <button class="deleteButton" data-card-id="${item.id}">Delete</button>
                <button onclick="closeModal()">Close</button>
            </div>
        `;

        // Event listener for editing a card from the modal
        modal.querySelector('.editButton').addEventListener('click', () => editCard(item));

        return modal;
    }

    // Show card details in a modal
    function showCardDetails(item) {
        const modal = createModal(item);
        document.body.appendChild(modal);
        modal.style.display = 'flex';
    }

    // Implement a function to edit the content of existing cards
    function editCard(item) {
        // Show a form or enable inline editing for modification
        // For simplicity, let's just update the author's name
        const newAuthor = prompt('Enter new author name:', item.author);
        if (newAuthor !== null) {
            item.author = newAuthor;
            // Update the card on the dashboard
            const card = document.getElementById(`card${item.id}`);
            card.querySelector('p').textContent = newAuthor;

            // Close the modal if it's open
            closeModal();
        }
    }

    // Event listener for adding a new card
    addCardButton.addEventListener('click', () => {
        const newItem = {
            id: Date.now(), // Unique identifier (for simplicity)
            author: 'New Author', // Default author name
            download_url: 'https://via.placeholder.com/200', // Placeholder image
        };

        const newCard = createCard(newItem);
        dashboard.appendChild(newCard);
    });

    // Implement a function to delete a card with confirmation dialogue
    function deleteCard(item) {
        // Show a confirmation dialogue
        const isConfirmed = confirm('Are you sure you want to delete this card?');

        if (isConfirmed) {
            // Remove the card from the dashboard
            const card = document.getElementById(`card${item.id}`);
            card.remove();

            // Close the modal if it's open
            closeModal();
        }
    }

    // Event listener for deleting a card
    dashboard.addEventListener('click', (event) => {
        const deleteButton = event.target.closest('.deleteButton');
        if (deleteButton) {
            const cardId = deleteButton.dataset.cardId;
            const item = { id: cardId }; // For simplicity, create a fake item
            deleteCard(item);
        }
    });

    // Close the modal
    window.closeModal = function () {
        const modal = document.querySelector('.modal');
        modal.style.display = 'none';
        modal.remove();
    };
});
s