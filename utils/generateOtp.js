
// is useful for generating a random four-digit number, which can serve various purposes in applications.
module.exports =()=>{
    return Math.floor(1000+Math.random()*9000).toString();
}