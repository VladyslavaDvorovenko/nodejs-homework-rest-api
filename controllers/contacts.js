const { Contact } = require("../models/contact");

const { HttpError } = require("../helpers/HttpError");
const { ctrlWrapper } = require("../helpers");

const getAll = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  const result = await Contact.find({ owner }, "", { skip, limit }).populate(
    "owner",
    "name email"
  );
  res.json(result);
};

const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findById(contactId);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

const deleteContacts = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndRemove(contactId);
  if (!result) throw HttpError(404, "Not Found");
  res.json({
    message: "Delete success",
  });
};

const changeContacts = async (req, res) => {
  const { name, email, phone } = req.body;
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(
    contactId,
    { name, email, phone },
    { new: true }
  );
  if (!result) throw HttpError(404, "Not Found");
  res.json(result);
};

const updateFavorite = async (req, res) => {
  const { contactId } = req.params;
  const { favorite } = req.body;
  if (favorite === undefined) {
    throw new HttpError(400, "Missing field 'favorite'");
  }

  const result = await Contact.findByIdAndUpdate(
    contactId,
    { favorite },
    { new: true }
  );

  if (!result) {
    throw new HttpError(404, "Not found");
  }

  res.json(result);
};

const addContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Contact.create({ ...req.body, owner });
  res.status(201).json(result);
};
module.exports = {
  getAll: ctrlWrapper(getAll),
  getContactById: ctrlWrapper(getContactById),
  changeContacts: ctrlWrapper(changeContacts),
  updateFavorite: ctrlWrapper(updateFavorite),
  deleteContacts: ctrlWrapper(deleteContacts),
  addContacts: ctrlWrapper(addContacts),
};
