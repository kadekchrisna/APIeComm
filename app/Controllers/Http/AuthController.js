'use strict'

const User = use('App/Models/User');

class AuthController {

    async login({ request, auth, response }) {

        const email = request.input("email")
        const password = request.input("password")
        try {
            if (await auth.attempt(email, password)) {
                let user = await User.findBy('email', email)
                let accessToken = await auth.generate(user)
                return response.json({ "user": user, "access_token": accessToken })
            }

        }
        catch (e) {
            return response.json({ message: 'You first need to register!' })
        }

    }
    async register({ request, auth, response }) {
        const username = request.input("username")
        const email = request.input("email")
        const password = request.input("password")

        let user = new User()
        user.username = username
        user.email = email
        user.password = password

        await user.save()
        let accessToken = await auth.generate(user)
        return response.json({ "user": user, "access_token": accessToken })
    }

    async getProfile({ response, auth }) {
        return response.send({ status: 1, "user": auth.current.user });
    }   

}

module.exports = AuthController
