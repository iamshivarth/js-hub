// API Service
// Single Responsibility Principle: This function is responsible only for fetching user data
const API_URL = "https://jsonplaceholder.typicode.com/users";

// Fetch user data from API
const fetchUsers = async () => {
    try {
        const res = await fetch(API_URL);
        return await res.json();
    } catch (error) {
        console.error("Error fetching users: ", error);
        return [];
    }
};

// Accordion Model
// Single Responsibility Principle: This factory function creates a single accordion item
// Open-Closed Principle: New properties can be added without modifying existing code
const createAccordionItem = (name, email) => ({
    name,
    email,
    isOpen: false,
    toggle() {
        this.isOpen = !this.isOpen;
    }
});

// Accordion View
// Single Responsibility Principle: These functions are responsible only for rendering the accordion
// Open-Closed Principle: New rendering functions can be added without modifying existing ones
const createAccordionView = (container) => {
    // Create individual accordion block
    const createAccordionBlock = (item, index, clickHandler) => {
        const block = document.createElement('div');
        block.className = 'accordion';

        const question = document.createElement('div');
        question.className = 'question';
        question.textContent = item.name;

        const expandIcon = document.createElement('span');
        expandIcon.className = 'expand-collapse';
        expandIcon.textContent = '+';
        question.appendChild(expandIcon);

        const answer = document.createElement('div');
        answer.className = 'answer';
        answer.textContent = item.email;

        block.appendChild(question);
        block.appendChild(answer);

        question.addEventListener('click', () => clickHandler(index));

        return { block, expandIcon, answer };
    };

    // Update accordion state (open/closed)
    const updateAccordion = (expandIcon, answer, isOpen) => {
        expandIcon.textContent = isOpen ? '-' : '+';
        answer.style.display = isOpen ? 'block' : 'none';
    };

    // Render all accordion items
    const render = (items, clickHandler) => {
        container.innerHTML = '';
        items.forEach((item, index) => {
            const { block, expandIcon, answer } = createAccordionBlock(item, index, clickHandler);
            updateAccordion(expandIcon, answer, item.isOpen);
            container.appendChild(block);
        });
    };

    return { render };
};

// Accordion Controller
// Single Responsibility Principle: This function manages the business logic of the accordion
// Dependency Inversion Principle: It depends on abstractions (view interface) not concretions
const createAccordionController = (view) => {
    let items = [];

    // Initialize accordion with user data
    const initialize = async () => {
        const userData = await fetchUsers();
        items = userData.map(user => createAccordionItem(user.name, user.email));
        render();
    };

    // Handle click on accordion item
    const handleClick = (index) => {
        if (items[index].isOpen) {
            items[index].toggle();
        } else {
            items.forEach((item, i) => {
                item.isOpen = (i === index);
            });
        }
        render();
    };

    // Render accordion
    const render = () => {
        view.render(items, handleClick);
    };

    return { initialize };
};

// Main
// Liskov Substitution Principle: Any object with a render method could be used here without altering the program's behavior
document.addEventListener("DOMContentLoaded", async function() {
    const accordionContainer = document.querySelector("#accordion-container");
    const view = createAccordionView(accordionContainer);
    const controller = createAccordionController(view);
    await controller.initialize();
});

// Interface Segregation Principle is followed throughout as each function has a specific, focused purpose
// This principle is particularly evident in how the view and controller interact

// Flow of the program:
// 1. DOM loads
// 2. Accordion view and controller are created
// 3. Controller initializes:
//    a. Fetches user data from API
//    b. Creates accordion items from user data
//    c. Renders the accordion
// 4. When user clicks an accordion item:
//    a. Controller updates the item states
//    b. View re-renders the accordion