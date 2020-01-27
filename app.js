// controller module pattern, IIFE allows us to hide inside code from outside scope
var budgetController = (function() {

    var x = 23;

    // making add variable a function
    var add = function(a) {
        return x + a;
    }
    // returning empty object with function method. Due to closures, this object method is able to access all variables inside budgetController.
    return {
        publicTest: function(b) {
            return add(b);
        }
    }

})();

var UIController = (function() {

    // Code

})();

// we add some arguments which will be used in the code and so we could access them from outside. 
var controller = (function(budgetCtrl, UICtrl) {

    // we don't have access from outside to this variable
    var z = budgetCtrl.publicTest(5);

    //so we have to create a method
    return {
        anotherPublic : function() {
            console.log(z);
        }
    }

})(budgetController, UIController); 
// we tell that when we invoke the function budgetCtrl = budgetController and UICtrl = UIController.
// these arguments budgetCtrl and UICtrl are general names so we could write the code, and then replace them by properties when invoking the function
// then we don't need to change the code inside, only properties when invoking