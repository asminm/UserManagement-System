const adminModel = require('../model/adminModel')
const bcrypt = require("bcrypt")
const userModel = require('../model/userModel')

const loadLogin = async (req, res) => {

  res.render("admin/login")
}


const login = async (req, res) => {


  try {

    const { email, password } = req.body

    const admin = await adminModel.findOne({ email })

    if (!admin) return res.render('admin/login', { message: 'user not found' })

    const ismatch = await bcrypt.compare(password, admin.password)

    if (!ismatch) return res.render('admin/login', { message: 'Icorrect password' })

    req.session.admin = true

    res.render('admin/dashboard',{message:'Login successful'})


  } catch (error) {

    res.send(error)

  }

}

const loadDashboard = async (req, res) => {
  try {

    const admin = req.session.admin;

    if (!admin) return res.redirect('/admin/login')

    const users = await userModel.find({})

    res.render('admin/dashboard', { users })

  } catch (error) {

  }
}


const searchUsers = async (req, res) => {

  if (req.session.admin) {
    const searchData = req.body

    const searchUser = await userModel.find({ email: { $regex: searchData.search, $options: 'i' } })
    res.render('admin/dashboard', { users: searchUser })
  } else {
    return res.redirect('/admin/dashboard');
  }

}




const editUser = async (req, res) => {
  try {

    const { email, password, id } = req.body

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await userModel.findOneAndUpdate({ _id: id },
      { $set: { email, password: hashedPassword } }
    )


    res.render("admin/dashboard", { message: "User updated successfully!" }); 

  } catch (error) {
    console.log(error)
  }

}

const deleteUser = async (req, res) => {

  try {

    const { id } = req.params

    const user = await userModel.findOneAndDelete({ _id: id })
    
    res.render("admin/dashboard", { message: "User deleted successfully!" });

  } catch (error) {

    console.log(error)
  }

}

const addUser = async (req, res) => {

  try {

    const { email, password } = req.body

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new userModel({
      email,
      password: hashedPassword
    })

    await newUser.save()
    
    res.render("admin/dashboard", { message: "User added successfully!" });

  } catch (error) {

    console.log(error)
  }

}



const logout = async (req, res) => {

  req.session.admin = null

  res.render("admin/login", { message: "Logged out successfully!" });

}
module.exports = {
  loadLogin,
  login,
  loadDashboard,
  editUser,
  deleteUser,
  addUser,
  searchUsers,
  logout,
}

