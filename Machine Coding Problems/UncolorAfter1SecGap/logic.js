// Single Responsibility Principle: The view is responsible for rendering the UI
const createView = (container) => {
    // Open-Closed Principle: New box types can be added without modifying existing code
    const createBox = (index, color, clickHandler) => {
        const box = document.createElement("div");
        box.className = `box ${color}`;
        box.id = `box-${index+1}`;
        box.textContent = index+1;

        box.addEventListener("click", () => clickHandler(index));

        return box;
    }

    const createHiddenBox = (index) => {
        const box = document.createElement("div");
        box.className = `box hidden`;
        box.id = `box-${index+1}`;
        box.textContent = index+1;
        return box;
    }

    // Dependency Inversion Principle: The view depends on abstractions (items and clickHandler) not concretions
    const render = (items, clickHandler) => {
        container.innerHTML = "";
        items.forEach((item) => {
            const box = item.hidden ? createHiddenBox(item.index) : createBox(item.index, "yellow", clickHandler);
            container.appendChild(box);
        });
    }

    return { render };
}

// Single Responsibility Principle: The controller is responsible for managing the application logic
const createController = (view) => {
    let items = [];
    let itemsVisible = [];
    let BOX_CLICKED_QUEUE = [];
    let unColorProcessLive = false;

    // Open-Closed Principle: New initialization logic can be added without modifying existing code
    const initialize = () => {
        items = Array.from({length: 9}, (_, index) => {return {index, hidden:  index === 4 || index === 5}});
        itemsVisible = items.filter((item) => !item.hidden);
        render();
    }

    const updateBox = (box, color, index) => {
        box.className = `box ${color}`;
        if(index !== null){
            BOX_CLICKED_QUEUE.push(index+1);
        }
        console.log(BOX_CLICKED_QUEUE);
    }

    // Single Responsibility Principle: This function is responsible for uncoloring boxes after a delay
    const unColorBoxAfterTSec = (queue, time) => {
        queue.forEach((element, index) => {
            setTimeout(() => {
                const box = document.getElementById(`box-${element}`);
                updateBox(box, "yellow", null);
                queue.pop();
                if(queue.length === 0){
                    unColorProcessLive = false;
                }
            }, time * 1000 * (index+1));
        });
    }

    // Open-Closed Principle: New click handling logic can be added without modifying existing code
    const clickHandler = (index) => {
        if(BOX_CLICKED_QUEUE.includes(index+1)){
            return;
        } else {
            const box = document.getElementById(`box-${index+1}`);
            if(unColorProcessLive){
                return;
            }
            updateBox(box, "green", index);

            if(BOX_CLICKED_QUEUE.length === itemsVisible.length){
                unColorProcessLive = true;
                unColorBoxAfterTSec(BOX_CLICKED_QUEUE, 1);
            }
        }
    }

    const render = () => {
        view.render(items, clickHandler);
    }

    return { initialize };
}

// Liskov Substitution Principle: Any object with an initialize method could be used here
document.addEventListener("DOMContentLoaded", function() {
    const container = document.getElementById("container");
    const view = createView(container);
    const controller = createController(view);
    controller.initialize();
});

// Flow of the program:
// 1. DOM loads
// 2. View and controller are created
// 3. Controller initializes:
//    a. Creates items (boxes)
//    b. Renders the boxes
// 4. When user clicks a box:
//    a. If the box is not already in the queue and un-color process is not live:
//       - Box is colored green
//       - Box index is added to the queue
//    b. If all boxes are clicked:
//       - un-color process starts
//       - Boxes are uncolored one by one with a 1-second delay
// 5. After all boxes are uncolored:
//    - un-color process is marked as not live
//    - Queue is emptied
// 6. The process can start again from step 4
