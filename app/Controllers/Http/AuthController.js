'use strict'

const User = use('App/Models/User');
const { validate } = use('Validator')

class AuthController {

    async login({ request, auth, response }) {

        try {

            const rules = {
                email: 'required|string',
                password: 'required'
            }
            const validation = await validate(request.all(), rules)
            if (validation.fails())
                return response.status(400).json({
                    message: validation.messages()
                })

            const email = request.input("email")
            const password = request.input("password")
            if (await auth.attempt(email, password)) {
                let user = await User.findBy('email', email)
                let accessToken = await auth.generate(user)
                return response.json({ "user": user, "access_token": accessToken })
            }

            return response.status(400).json({
                message: 'Login Fail.'
            })

        }
        catch (e) {
            return response.status(400).json({ message: 'Something went wrong!' })
        }

    }
    async register({ request, auth, response }) {

        try {
            const rules = {
                username: 'required|string',
                email: 'required|string',
                password: 'required|string'
            }
            const validation = await validate(request.all(), rules)
            if (validation.fails())
                return response.status(400).json({
                    message: validation.messages()
                })

            const username = request.input("username")
            const email = request.input("email")
            const password = request.input("password")

            const check = await User.query()
                .where('email', email)
                .orWhere( 'username', username )
                .getCount()
            if(check>0) return response.status(400).json({
                message: 'Duplicate email or username.'
            })

            // console.log(check);
            
            let user = new User()
            user.username = username
            user.email = email
            user.password = password

            await user.save()
            let accessToken = await auth.generate(user)
            return response.json({ "user": user, "access_token": accessToken })

        } catch (error) {
            return response.status(400).json({
                message: 'Something went wrong!'
            })

        }
    }

    async getProfile({ response, auth }) {
        return response.send({ status: 1, "user": auth.current.user });
    }

}

module.exports = AuthController
