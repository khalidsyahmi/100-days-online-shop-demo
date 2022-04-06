const bcrypt = require('bcryptjs');
const mongodb = require('mongodb');

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

    static findById(userId) {
        const uid = new mongodb.ObjectId(userId);
    
        return db
          .getDb()
          .collection('users')
          .findOne({ _id: uid }, { projection: { password: 0 } });
      }

    getUserSameEmail() {
        return db.getDb().collection('users').findOne({ email: this.email });
    }

    async existsAlready() {
        const existingUser = await this.getUserSameEmail();
        if (existingUser) {
            return true;
        }
        return false;
    }

    hasMatchingPassword(hashedPassword) {
        return bcrypt.compare(this.password, hashedPassword);
    }

}

module.exports = User;