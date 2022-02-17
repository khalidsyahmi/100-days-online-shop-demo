const bcrypt = require('bcryptjs');

const db = require('../database/database');

class User {
    constructor(
        email, password,
        fullname, street, postal, city
    ) {
        this.email = email;
        this.password = password;
        this.fullname = fullname;
        this.address = {
            street: street,
            postal: postal,
            city: city
        }
    }

    async signup() {
        const hashedPassword = await bcrypt.hash(this.password, 12);

        await db.getDb().collection('users').insertOne({
            email: this.email,
            password: hashedPassword,
            name: this.fullname,
            address: this.address
        });
    }

    getyUserSameEmail() {
        return db.getDb().collection('users').findOne({ email: this.email });
    }

    hasMatchingPassword(hashedPassword) {
        return bcrypt.compare(this.password, hashedPassword);
    }

    async existingUser() {

    }


}

module.exports = User;