const UserModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;
require("dotenv").config();
const jwt = require("jsonwebtoken");

//voir liste des utilisateurs
module.exports.getAllUsers = async (req, res) => {
  const users = await UserModel.find().select("-password");
  res.status(200).json(users);
};

// voir infos d'un utilisateur(profil)
module.exports.userInfo = (req, res) => {
  console.log(req.params);
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknow : " + req.params.id);

  UserModel.findById(req.params.id, (err, docs) => {
    if (!err) res.send(docs);
    else console.log("ID unknow: " + err);
  }).select("-password");
};

//mettre à jour ou modifier un utilisateur
module.exports.updateUser = async (req, res) => { 
  const token = req.cookies.jwt;
  const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
  const role = decodedToken.role;
  if (decodedToken.id != req.params.id && role != "ADMIN")
    return res.status(403).send("Vous n'avez pas le droit de modifier le profil");

  try {
    await UserModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          job: req.body.job,
          name: req.body.name,
          firstname: req.body.firstname,
          email: req.body.email,
          picture: req.body.picture
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true },
      (err, docs) => {
        if (!err) return res.send(docs);
        else return res.status(500).send({ message: err });
      }
    ).clone();
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

//supprimer un utilisateur
module.exports.deleteUser = async (req, res) => {
  const token = req.cookies.jwt;
  const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
  const role = decodedToken.role;
  if (decodedToken.id != req.params.id && role != "ADMIN")
    return res.status(400).send("Vous n'avez pas le droit de supprimer cet utilisateur");

  try {
    await UserModel.remove({ _id: req.params.id }).exec();
    res.status(200).json({ message: "Successfully deleted" });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

//suivre un utilisateur
module.exports.follow = async (req, res) => {
  if (
    !ObjectID.isValid(req.params.id) ||
    !ObjectID.isValid(req.body.idToFollow)
  )
    return res.status(400).send("ID unknow : " + req.params.id);

  try {
    //add to the follower list
    await UserModel.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { following: req.body.idToFollow } },
      { new: true, upsert: true },
      (err, docs) => {
        if (!err) res.status(201).json(docs);
        else return res.status(400).json(err);
      }
    ).clone();
    //add to followwing list
    await UserModel.findByIdAndUpdate(
      req.body.idToFollow,
      { $addToSet: { followers: req.params.id } },
      { new: true, upsert: true },
      (err, docs) => {
        if (err) return res.status(400).json(err);
      }
    ).clone();
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

//ne plus suivre un utilisateur
module.exports.unfollow = async (req, res) => {
  if (
    !ObjectID.isValid(req.params.id) ||
    !ObjectID.isValid(req.body.idToUnfollow)
  )
    return res.status(400).send("ID unknow : " + req.params.id);

  try {
    //add to the follower list
    await UserModel.findByIdAndUpdate(
      req.params.id,
      { $pull: { following: req.body.idToUnfollow } },
      { new: true, upsert: true },
      (err, docs) => {
        if (!err) res.status(201).json(docs);
        else return res.status(400).json(err);
      }
    ).clone();
    //add to followwing list
    await UserModel.findByIdAndUpdate(
      req.body.idToUnfollow,
      { $pull: { followers: req.params.id } },
      { new: true, upsert: true },
      (err, docs) => {
        if (err) return res.status(400).json(err);
      }
    ).clone();
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};
