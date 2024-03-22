const bcrypt = require('bcryptjs');

const salt = bcrypt.genSaltSync(10);
const hashPassword = (password) => {
    return bcrypt.hashSync(password, salt);
};

const isPasswordValid = (frontEndPassword, backendPassword) => {
    return bcrypt.compareSync(frontEndPassword, backendPassword)
}

if(require.main === module) {
    process.stdin.setEncoding('utf8');

    console.log('Password to hash:');

    process.stdin.on('data', (data) => {
        const userInput = data.trim();
        if (userInput === 'exit') {
            process.exit();
        }
    console.log(`hashed password: ${hashPassword(userInput)}`);

    });
}


module.exports = { hashPassword, isPasswordValid };