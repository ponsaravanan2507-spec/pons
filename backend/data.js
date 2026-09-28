// Restaurant + menu seed data. Add an `image` URL to any restaurant/item to show a photo instead of the emoji.
const CATS=[["🍔","Burgers"],["🍕","Pizza"],["🍜","Asian"],["🍛","Indian"],["🌮","Mexican"],["🍰","Desserts"],["☕","Beverages"],["🥗","Healthy"]];
// [name,cuisine,emoji,rating,mins,fee,dist,tint,[items: name,price,emoji,veg]]
const R=[
["Burger House","Burgers","🍔",4.5,25,29,1.8,"#ffd9a8",[["Classic Chicken Burger",199,"🍔",0],["Cheese Veg Burger",159,"🍔",1],["Peri Peri Fries",99,"🍟",1],["Loaded Nachos",149,"🌮",1]]],
["Pizza Street","Pizza","🍕",4.4,30,35,2.4,"#ffc9b8",[["Margherita",249,"🍕",1],["Pepperoni Feast",349,"🍕",0],["Garlic Bread",129,"🥖",1]]],
["Urban Spice","Indian","🍛",4.6,35,25,3.1,"#ffe2b5",[["Butter Chicken",289,"🍛",0],["Paneer Tikka Masala",249,"🍛",1],["Garlic Naan",49,"🫓",1],["Hyderabadi Biryani",279,"🍚",0]]],
["Chennai Bites","Indian","🥘",4.7,22,20,1.2,"#f9d9a0",[["Ghee Podi Idli",89,"🍘",1],["Masala Dosa",99,"🥞",1],["Chettinad Chicken Meals",229,"🍗",0],["Filter Coffee",49,"☕",1]]],
["The Food Yard","Healthy","🥗",4.3,28,30,2.9,"#d5efc9",[["Grilled Chicken Salad",239,"🥗",0],["Quinoa Power Bowl",259,"🥙",1],["Fresh Fruit Bowl",149,"🍓",1]]],
["Spice Route","Asian","🍜",4.5,32,35,3.5,"#ffd0c0",[["Chicken Ramen",279,"🍜",0],["Veg Hakka Noodles",189,"🍝",1],["Chicken Momos",149,"🥟",0],["Kung Pao Paneer",229,"🥡",1]]],
["Green Bowl","Healthy","🥬",4.2,24,25,2.0,"#cdeed2",[["Falafel Wrap",179,"🌯",1],["Avocado Toast",199,"🥑",1],["Green Detox Juice",119,"🧃",1]]],
["The Dessert Lab","Desserts","🍰",4.8,20,30,1.5,"#fdd3e3",[["Molten Lava Cake",159,"🍫",1],["Belgian Waffle",179,"🧇",1],["Blueberry Cheesecake",189,"🍰",1]]],
["Taco Fiesta","Mexican","🌮",4.1,33,40,4.2,"#ffe0a3",[["Chicken Tacos (3)",219,"🌮",0],["Bean Burrito",189,"🌯",1],["Guacamole & Chips",139,"🥑",1]]],
["Brew & Co","Beverages","☕",4.4,18,20,0.9,"#e6d2bf",[["Cold Brew",139,"🧋",1],["Cappuccino",119,"☕",1],["Mango Smoothie",129,"🥭",1]]],
["Wok Express","Asian","🥡",4.0,27,30,2.7,"#ffd6b0",[["Schezwan Fried Rice",169,"🍚",1],["Chilli Chicken",219,"🍗",0],["Spring Rolls",119,"🌯",1]]],
["Sweet Tooth","Desserts","🍩",4.6,21,25,1.7,"#fbd0d8",[["Choco Donut Box",249,"🍩",1],["Gulab Jamun (4)",99,"🍮",1],["Ice Cream Sundae",149,"🍨",1]]]
].map((r,i)=>({id:i,name:r[0],cuisine:r[1],emoji:r[2],rating:r[3],mins:r[4],fee:r[5],dist:r[6],tint:r[7],items:r[8].map((m,j)=>({id:i+"-"+j,name:m[0],price:m[1],emoji:m[2],veg:!!m[3],rid:i})),veg:r[8].every(m=>m[3])}));

module.exports={CATS,R};
