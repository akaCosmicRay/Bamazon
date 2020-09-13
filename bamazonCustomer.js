var mysql = require ("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table2");

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "bamazon_db",
    port: 3306
})
connection.connect();

var display = function(){
    connection.query("SELECT * FROM products", function(err, res){
        if (err) throw err;
        console.log("");
        console.log("   Welcome to Bamazon  ");
        console.log("---------------------");
        console.log("");
        console.log("Find Your Product Below");
        console.log("");
    
    var table = new Table({
        head: ["Product Id", "Product Description", "Cost"],
        colWidths: [12, 50, 8],
        colAligns: ["center", "left", "right"],
        stype: {
            head: ["aqua"],
            compact: true
        }
    });
    for (var i = 0; i < res.length; i++){
        table.push([res[i].id, res[i].products_name, res[i].price]);
    }
    console.log(table.toString());
    console.log("");
});
};



var shopping = function(){
    inquirer
    .prompt({
        name: "productToBuy",
        type: "input",
        message: "Please enter the Product Id of the item you wish to purchase."
    })
    .then(function(answer1){
        var selection = answer1.productToBuy;
        connection.query("SELECT * FROM products WHERE Id=?", selection, function(err, res){
            if (err) throw err;
            if (res.length === 0){
                console.log("That Product doesn't exist, Please enter a Product Id from the list above");
                shopping();
            } else{
                inquirer.prompt({
                    name: "quanyity",
                    type: "input",
                    message: "How many would you like to purchase?"
                }).then(function(answer2){
                    var quantity = answer2.quantity;
                    if (quantity > res[0].stock_quanity){
                        console.log("Our apologies we only have " + res[0].stock_quanity + " items of product selected")
                        shopping();
                    }else{
                        console.log("");
                        console.log(res[0].products_name + " purchased");
                        console.log(quantity + " qty @ $" + res[0].price);

                        var newQuantity = res[0].stock_quanity;
                        connection.query(
                            "UPDATE products SET stock_quanity = " + newQuantity + " WHERE id = " + res[0].id, function(err, resUpdate){
                                if (err) throw err;
                                console.log("");
                                console.log("Your order has been processed");
                                console.log("Thank you for shopping with us!");
                                console.log("");
                                connection.end();

                            }
                        )
                    }
                })
            }
            
            
        });
    });
};

display();
shopping();



