let db = require("./db");
let Students = require("./Studetns/model");

db.connectAsync();

const student1 = new Students({
    email: "test@gmail.com",
    password: "qwerty1",
    location: "Yerevan",
    lastName: "Testyan",
    firstName: "Test_1",
    learningTargets: ["GameDev"],
});

const student2 = new Students({
    email: "test2@gmail.com",
    password: "qwerty2",
    location: "Yerevan",
    lastName: "Testyan",
    firstName: "Test_2",
    learningTargets: ["Prog"],
});


(async function () {
    await student1.save()
        .then(res => console.log(res.email))
        .catch(err => console.log(err));
    await student2.save()
        .then(res => console.log(res.email))
        .catch(err => console.log(err));

        db.disconnect();
})(); 

