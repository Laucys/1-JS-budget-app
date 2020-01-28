
//************************** BUDGET CONTROLLER ************************
//*********************************************************************
var budgetController = (function () {

    // Creating Expense and Income constructor functions so objects could be created following this default data
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    // Calculating total incomes and expenses depending on type, getting data from data arrays
    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(cur){
            sum += cur.value;
        });

        data.totals[type] = sum;
    };


    // We could store all Income, Expenses and total budget data in separate arrays, but as we aware about objects, we can store all data in one object.
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };

    // Creating object which will contain our all public methods
    return {
        addItem: function(type, des, val) {

            // Variable where we store newly created objects
            var newItem, ID;

            // Create new ID, ID = last ID + 1
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length -1].id + 1;
            } else {
                ID = 0;
            }
            
        
            // If input type is exp, then we create new Expense object, if inc then Income object
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }

            // We select data object and if we have [type] = exp, then we push Expense new object to allItems array, if [type] = inc, then to Income array
            data.allItems[type].push(newItem)

            // Return new element
            return newItem;
        },

        // Calculate the budget function
        calculateBudget: function () {

            // Calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            // Calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            // Calculate the percentage of income that we spent
                data.percentage = Math.round ((data.totals.exp / data.totals.inc) * 100);
        
        },

        // Creating method to retrieve data from calculateBudget function
        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },

        testing: function() {
            console.log(data);
        }
    };

})();


// ***************************** UI CONTROLLER ****************************
// ************************************************************************

var UIController = (function () {

    // Using object to store all strings from HTMl so it would be easier to edit and have in one place.
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage'
    };

    // Creating object in order to make method/function public
    return {
        getInput: function () {

            // In order to return all 3 values at the same time, we put them in object and return them.
            return {

                // Get data from type button. Type button has inc and exp options. So it will read and get option which is selected.
                type: document.querySelector(DOMstrings.inputType).value,

                // Get input data from description field
                description: document.querySelector(DOMstrings.inputDescription).value,

                // Get input data from value field and make it a number 
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },

        addListItem: function(obj, type) {

            var html, newHtml, element;

            // Create HTML string with placeholder text
            // Take html code from index for incomes and expenses items
            if (type === 'inc') {
                element = DOMstrings.incomeContainer;

                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;

                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            // Replace the placeholder text with some actual data
            // In newHtml variable we put our replacement method. Search for string '%value%' and replace with actual object value
            newHtml = html.replace('%id%', obj.id);
            // We replace in newHtml so replaced id still would be there
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            // Insert the newHtml into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);   

        },

        // Clear input fields
        clearFields: function() {
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

            // Trick to put list items in array
            var fieldsArr = Array.prototype.slice.call(fields);

            // Loopin though array and putting empty space in input fields
            fieldsArr.forEach(function(current, index, array) {
                current.value = '';
            });

            fieldsArr[0].focus();
        },

        displayBudget: function(obj) {

            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;
            

            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
        },

        // We create new object with function in order to make it public and be able to pass to controller module.
        getDOMstrings: function () {
            return DOMstrings;
        }
    };

})();


// ************************ GLOBAL APP CONTROLLER **************************
// *************************************************************************

var controller = (function (budgetCtrl, UICtrl) {

    var setupEventListeners = function () {

        // We get DOMStrings object from UIController module
        var DOM = UICtrl.getDOMstrings();

        // store in object all selected HTML items
        var selectors = {
        submitBtn: document.querySelector(DOM.inputBtn)
    }

        // When you click on submit button, ctrlAddItem function will return;
        selectors.submitBtn.addEventListener('click', ctrlAddItem);

        // When you press ENTER key (13) it will return ctrlAddItem function;
        document.addEventListener('keypress', function (event) {
        if (event.keyCode === 13) {
            ctrlAddItem();
        }
    });
};

    var updateBudget = function() {

        // 1. Calculate the budget 
        budgetCtrl.calculateBudget();

        // 2. Return the budget
        // We get data from returned getBudget method and store it to budget variable
        var budget = budgetCtrl.getBudget();

        // 3. Display the budget on the UI
        UICtrl.displayBudget(budget);
    };

    // function which return after enter or submit button are clicked
    var ctrlAddItem = function () {

        var input, newItem;

        // 1. Get field input data
        input = UICtrl.getInput();

        // If description field is not empty and value is not NaN and value is bigger than 0, then we add items to the list
        if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
        // 2. Add item to the budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);

        // 3. Add the item to the UI
        UICtrl.addListItem(newItem, input.type);

        // 4. Clear fields
        UICtrl.clearFields();

        // 5. Calculate and update budget
        updateBudget();
        }

    };

    // Since setupEventListener function is inside our controller model it can be shown to public. We have to return function in object so it would be public and could run our setupEventListener function.
    return {
        init: function() {
            console.log('Application has started.');
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: 0
            });
            setupEventListeners();
        }
    };

})(budgetController, UIController);


// Init function is public, so we access it an run it so our eventListeners start working.
controller.init();

