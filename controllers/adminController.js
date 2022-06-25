const Category = require("../models/Category");
const User = require("../models/User");
const Bank = require("../models/Bank");
const Booking = require("../models/Booking");
const Item = require("../models/Item");
const Image = require("../models/Image");
const Feature = require("../models/Feature");
const Activity = require("../models/Activity");
const Member = require("../models/Member");
const fs = require("fs-extra");
const path = require("path");
const bcrypt = require("bcrypt");
const { count } = require("console");
const { features } = require("process");
module.exports = {
  viewSignIn: async (req, res) => {
    try {
      /**
       * kalau belum ada session user render index
       * kalau sudah ada tidak boleh ke viewSignIn, redirect ke admin/dashboard
       */
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      if (req.session.user == null || req.session.user == undefined) {
        res.render("index", {
          alert,
          title: "Staycation | Signin",
        });
      } else {
        res.redirect("/admin/dashboard");
      }
    } catch (error) {
      //res.redirect("/admin/signin");
    }
  },
  actionSignIn: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username: username });
      if (!user) {
        req.flash("alertMessage", `User ${username} tidak ada!`);
        req.flash("alertStatus", "danger");
        res.redirect("/admin/signin");
      }
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        req.flash("alertMessage", `Password yang anda masukkan tidak sesuai!`);
        req.flash("alertStatus", "danger");
        res.redirect("/admin/signin");
      }

      /**
       * buat session jika user berhasil login
       */
      req.session.user = {
        id: user.id,
        username: user.username,
      };
      res.redirect("/admin/dashboard");
    } catch (error) {
      //res.redirect("/admin/signin");
    }
  },
  actionLogout: async (req, res) => {
    req.session.destroy();
    res.redirect("/admin/signin");
  },
  viewDashboard: async (req, res) => {
    try {
      const member = await Member.find();
      const booking = await Booking.find();
      const item = await Item.find();
      res.render("admin/dashboard/view_dashboard", {
        title: "Staycation | Dashboard",
        username: req.session.user.username,
        member: member,
        booking: booking,
        item: item,
      });
    } catch (error) {}
  },
  viewCategory: async (req, res) => {
    try {
      const category = await Category.find();
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/category/view_category", {
        category,
        alert,
        title: "Staycation | Category",
        username: req.session.user.username,
      });
    } catch (error) {
      res.redirect("/admin/category");
    }
  },
  addCategory: async (req, res) => {
    let error;
    try {
      const { name } = req.body;
      await Category.create({ name });
      req.flash("alertMessage", `Successfully added ${name}!`);
      req.flash("alertStatus", "success");
      res.redirect("/admin/category");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/category");
    }
  },
  editCategory: async (req, res) => {
    try {
      /**
       * Destructure dari atrribute name pada edit_modal
       * name="id" & name="name" pada tag
       */
      const { id, name } = req.body;
      const category = await Category.findOne({ _id: id });
      category.name = name;
      await category.save();
      req.flash("alertMessage", `Successfully update category ${id}!`);
      req.flash("alertStatus", "success");
      res.redirect("/admin/category");
    } catch (error) {
      req.flash("alertMessage", `Failed to update category`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/category");
    }
  },
  deleteCategory: async (req, res) => {
    try {
      const { id } = req.body;
      Category.deleteOne({ _id: id }, (err, res) => {
        err ? console.log(err) : console.log(res);
      });
      req.flash("alertMessage", `Successfully delete category ${id}!`);
      req.flash("alertStatus", "success");
      res.redirect("/admin/category");
    } catch (error) {
      req.flash("alertMessage", `Failed to delete category!`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/category");
    }
  },
  viewBank: async (req, res) => {
    const bank = await Bank.find();
    const alertMessage = req.flash("alertMessage");
    const alertStatus = req.flash("alertStatus");
    const alert = { message: alertMessage, status: alertStatus };
    res.render("admin/bank/view_bank", {
      bank,
      alert,
      title: "Staycation | Bank",
      username: req.session.user.username,
    });
  },
  addBank: async (req, res) => {
    try {
      const { bankName, accountName, accountNumber } = req.body;

      await Bank.create({
        bankName,
        accountNumber,
        accountName,
        imageUrl: `images/${req.file.filename}`,
      });
      req.flash(
        "alertMessage",
        `Successfully added ${bankName} ${accountName}!`
      );
      req.flash("alertStatus", "success");
      res.redirect("/admin/bank");
    } catch (error) {
      req.flash("alertMessage", `Failed to add new Bank!`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/bank");
    }
  },
  editBank: async (req, res) => {
    try {
      const { id, bankName, accountName, accountNumber } = req.body;
      const bank = await Bank.findOne({ _id: id });
      if (req.file == undefined) {
        bank.bankName = bankName;
        bank.accountName = accountName;
        bank.accountNumber = accountNumber;
        await bank.save();
      } else {
        await fs.unlink(path.join(`public/${bank.imageUrl}`));
        bank.bankName = bankName;
        bank.accountName = accountName;
        bank.accountNumber = accountNumber;
        bank.imageUrl = `images/${req.file.filename}`;
        await bank.save();
      }

      req.flash("alertMessage", `Successfully update bank ${id}`);
      req.flash("alertStatus", "success");
      res.redirect("/admin/bank");
    } catch (error) {
      req.flash("alertMessage", `Failed to update bank`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/bank");
    }
  },
  deleteBank: async (req, res) => {
    try {
      const { id } = req.body;
      const bank = await Bank.findOne({ _id: id });
      await fs.unlink(path.join(`public/${bank.imageUrl}`));
      Bank.deleteOne({ _id: id }, (err, res) => {
        err ? console.log(err) : console.log(res);
      });
      req.flash("alertMessage", `Successfully delete bank ${id}`);
      req.flash("alertStatus", "success");
      res.redirect("/admin/bank");
    } catch (error) {
      console.log(error);
      req.flash("alertMessage", `Failed to delete bank`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/bank");
    }
  },
  viewItem: async (req, res) => {
    try {
      const item = await Item.find()
        .populate({
          path: "imageId",
          select: "id imageUrl",
        })
        .populate({
          path: "categoryId",
          select: "id name",
        });
      const category = await Category.find();
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/item/view_item", {
        category,
        title: "Staycation | Item",
        alert,
        item,
        action: "View",
        username: req.session.user.username,
      });
    } catch (error) {
      req.flash("alertMessage", `Failed to delete Item`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
    }
  },
  addItem: async (req, res) => {
    try {
      /**
       * Get all value from the form in add_item.ejs
       * from attribute name
       */
      const { categoryId, title, price, city, country, description } = req.body;
      /**
       * if multiple files
       */
      if (req.files.length > 0) {
        //get category obj from categoryId
        const category = await Category.findOne({ _id: categoryId });
        const newItem = {
          categoryId: category._id,
          title,
          price,
          city,
          country,
          description,
        };
        //create the item from destructure
        const item = await Item.create(newItem);
        /**
         * PUSH ITEM ID KE CATEGORY.ITEMID
         */
        category.itemId.push({ _id: item._id });
        await category.save();
        /**
         * save each file
         */
        for (let i = 0; i < req.files.length; i++) {
          //save image to Image model
          const saveImages = await Image.create({
            imageUrl: `images/${req.files[i].filename}`,
          });
          /**
           * Push image ke image id di item (relasi)
           */
          item.imageId.push({ _id: saveImages._id });
          await item.save();
        }
        req.flash("alertMessage", `Successfully add item`);
        req.flash("alertStatus", "success");
        res.redirect("/admin/item");
      }
    } catch (error) {
      req.flash("alertMessage", `Failed to add Item`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
    }
  },
  showDetailItem: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Item.findOne({ _id: id })
        .populate({
          path: "featureId",
          select: "id name qty imageUrl",
        })
        .populate({
          path: "activityId",
          select: "name type imageUrl",
        });

      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/item/detail_item", {
        title: "Staycation | Show Item Details",
        alert,
        item,
        username: req.session.user.username,
      });
    } catch (error) {
      console.log(error);
      req.flash("alertMessage", `Failed to show item details`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
    }
  },
  showItemImage: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Item.findOne({ _id: id }).populate({
        path: "imageId",
        select: "id imageUrl",
      });
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/item/view_item", {
        title: "Staycation | Show Item Images",
        alert,
        item,
        action: "Show Image",
        username: req.session.user.username,
      });
    } catch (error) {
      req.flash("alertMessage", `Failed to show Item Image`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
    }
  },
  editItem: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Item.findOne({ _id: id })
        .populate({
          path: "categoryId",
          select: "id name",
        })
        .populate({
          path: "imageId",
          select: "id imageUrl",
        });
      const category = await Category.find();
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/item/view_item", {
        title: "Staycation | Edit Item",
        alert,
        item,
        category,
        action: "Edit",
        username: req.session.user.username,
      });
    } catch (error) {
      req.flash("alertMessage", `Failed to show edit Item`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
    }
  },
  updateItem: async (req, res) => {
    try {
      const { id, title, price, country, city, description, categoryId } =
        req.body;
      const item = await Item.findOne({ _id: id });
      if (req.files.length == 0) {
        item.title = title;
        item.price = price;
        item.country = country;
        item.city = city;
        item.description = description;
        item.categoryId = categoryId;
        await item.save();
        req.flash("alertMessage", `Successfully Update Item`);
        req.flash("alertStatus", "success");
        res.redirect("/admin/item");
      } else {
        item.title = title;
        item.price = price;
        item.country = country;
        item.city = city;
        item.description = description;
        item.categoryId = categoryId;
        for (let i = 0; i < item.imageId.length; i++) {
          //get image object by id
          const imageUpdate = await Image.findOne({ _id: item.imageId[i] });
          //unlink image saved
          await fs.unlink(path.join(`public/${imageUpdate.imageUrl}`));
          //replace imageurl with current image filename
          imageUpdate.imageUrl = `images/${req.files[i].filename}`;
          await imageUpdate.save();
        }
        await item.save();
        req.flash("alertMessage", `Successfully Update Item`);
        req.flash("alertStatus", "success");
        res.redirect("/admin/item");
      }
    } catch (error) {
      req.flash("alertMessage", `Failed to Update Item`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
    }
  },
  deleteItem: async (req, res) => {
    try {
      const { id } = req.body;
      const item = await Item.findOne({ _id: id }).populate("imageId");
      for (let i = 0; i < item.imageId.length; i++) {
        await Image.findOne({ _id: item.imageId[i] }).then((res) => {
          fs.unlink(path.join(`public/${res.imageUrl}`));
          res.remove();
        });
      }
      await item.remove();
      req.flash("alertMessage", `Successfully Delete Item`);
      req.flash("alertStatus", "success");
      res.redirect("/admin/item");
    } catch (error) {
      req.flash("alertMessage", `Failed to Delete Item`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/item");
    }
  },
  addItemFeature: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, qty } = req.body;
      const item = await Item.findOne({ _id: id });
      const feature = await Feature.create({
        name,
        qty,
        imageUrl: `/images/${req.file.filename}`,
        itemId: id,
      });
      const featureId = await feature.save();
      item.featureId.push({ _id: featureId.id });
      await item.save();
      req.flash("alertMessage", `Successfully added Item Feature`);
      req.flash("alertStatus", "success");
      res.redirect(`/admin/item/detail/${id}`);
    } catch (error) {
      const { id } = req.params;
      req.flash("alertMessage", "Failed to add Item Feature");
      req.flash("alertStatus", "danger");
      res.redirect(`/admin/item/detail/${id}`);
    }
  },
  updateItemFeature: async (req, res) => {
    try {
      const { id, featureId, name, qty } = req.body;

      if (!req.file) {
        const feature = await Feature.findOne({ _id: featureId });
        feature.name = name;
        feature.qty = qty;
        await feature.save();
        req.flash("alertMessage", `Successfully Updated Item Feature`);
        req.flash("alertStatus", "success");
        res.redirect(`/admin/item/detail/${id}`);
      } else {
        const feature = await Feature.findOne({ _id: featureId });
        feature.name = name;
        feature.qty = qty;
        await fs.unlink(path.join(`public/${feature.imageUrl}`));
        feature.imageUrl = `/images/${req.file.filename}`;
        await feature.save();
        req.flash("alertMessage", `Successfully Updated Item Feature`);
        req.flash("alertStatus", "success");
        res.redirect(`/admin/item/detail/${id}`);
      }
    } catch (error) {
      const { id } = req.body;
      req.flash("alertMessage", "Failed to Update Item Feature");
      req.flash("alertStatus", "danger");
      res.redirect(`/admin/item/detail/${id}`);
    }
  },
  deleteItemFeature: async (req, res) => {
    try {
      const { id, featureId } = req.body;
      const feature = await Feature.findOne({ _id: featureId });
      const item = await Item.findOne({ _id: id }).populate("featureId");
      await fs.unlink(path.join(`public/${feature.imageUrl}`));
      await feature.remove();
      item.featureId.forEach(async (res, index) => {
        res.id == featureId ? item.featureId.pull({ _id: featureId }) : "";
      });
      await item.save();
      req.flash("alertMessage", `Successfully Deleted Item Feature`);
      req.flash("alertStatus", "success");
      res.redirect(`/admin/item/detail/${id}`);
    } catch (error) {
      const { id } = req.body;
      req.flash("alertMessage", "Failed to Delete Item Feature");
      req.flash("alertStatus", "danger");
      res.redirect(`/admin/item/detail/${id}`);
    }
  },
  addItemActivity: async (req, res) => {
    const { id } = req.params;
    try {
      const { name, type } = req.body;
      const item = await Item.findOne({ _id: id });
      const activity = await Activity.create({
        name,
        type,
        imageUrl: `images/${req.file.filename}`,
      });
      const activityId = await activity.save();
      item.activityId.push({ _id: activityId.id });
      await item.save();
      req.flash("alertMessage", "Successfully added Item Activity");
      req.flash("alertStatus", "success");
      res.redirect(`/admin/item/detail/${id}`);
    } catch (error) {
      req.flash("alertMessage", "Failed to Add Item Activity");
      req.flash("alertStatus", "danger");
      res.redirect(`/admin/item/detail/${id}`);
    }
  },
  updateItemActivity: async (req, res) => {
    try {
      const { id, activityId, name, type } = req.body;
      const activity = await Activity.findOne({ _id: activityId });
      const item = await Item.findOne({ _id: id });
      activity.name = name;
      activity.type = type;
      if (req.file) {
        await fs.unlink(path.join(`public/${activity.imageUrl}`));
        activity.imageUrl = `images/${req.file.filename}`;
      }
      await activity.save();
      req.flash("alertMessage", `Successfully Updated Item Activity`);
      req.flash("alertStatus", "success");
      res.redirect(`/admin/item/detail/${id}`);
    } catch (error) {
      req.flash("alertMessage", "Failed to Update Item Activity");
      req.flash("alertStatus", "danger");
      res.redirect(`/admin/item/detail/${id}`);
    }
  },
  deleteItemActivity: async (req, res) => {
    const { id, activityId } = req.body;
    try {
      const activity = await Activity.findOne({ _id: activityId }).populate(
        "itemId"
      );
      const item = await Item.findOne({ _id: id });
      item.activityId.forEach(async (res, index) => {
        res == activityId ? item.activityId.pull({ _id: activityId }) : "";
      });
      await item.save();
      await fs.unlink(path.join(`public/${activity.imageUrl}`));
      await activity.remove();
      req.flash("alertMessage", `Successfully Delete Item Activity`);
      req.flash("alertStatus", "success");
      res.redirect(`/admin/item/detail/${id}`);
    } catch (error) {
      console.log(error);
      req.flash("alertMessage", "Failed to Delete Item Activity");
      req.flash("alertStatus", "danger");
      res.redirect(`/admin/item/detail/${id}`);
    }
  },
  viewBooking: async (req, res) => {
    try {
      const booking = await Booking.find()
        .populate("memberId")
        .populate("bankId");
      res.render("admin/booking/view_booking", {
        title: "Staycation | Booking",
        username: req.session.user.username,
        booking: booking,
      });
    } catch (error) {
      res.redirect("/admin/booking");
    }
  },
  showDetailBooking: async (req, res) => {
    try {
      const { id } = req.params;
      const booking = await Booking.findOne({ _id: id })
        .populate("memberId")
        .populate("itemId");
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/booking/show_detail_booking", {
        title: "Staycation | Detail Booking",
        username: req.session.user.username,
        booking: booking,
        alert,
      });
      console.log(booking);
    } catch (error) {
      res.redirect("/admin/booking");
    }
  },
  actionConfirmBooking: async (req, res) => {
    try {
      const { id } = req.params;
      const booking = await Booking.findOne({ _id: id });
      if (booking) {
        booking.payments.status = "Accepted";
        await booking.save();
        req.flash("alertMessage", `Succesfully Confirm Booking ${id}`);
        req.flash("alertStatus", "success");
        res.redirect(`/admin/booking/${id}`);
      }
    } catch (error) {
      res.redirect(`/admin/booking/${id}`);
    }
  },
  actionRejectBooking: async (req, res) => {
    try {
      const { id } = req.params;
      const booking = await Booking.findOne({ _id: id });
      if (booking) {
        booking.payments.status = "Rejected";
        await booking.save();
        req.flash("alertMessage", `Succesfully Reject Booking ${id}`);
        req.flash("alertStatus", "success");
        res.redirect(`/admin/booking/${id}`);
      }
    } catch (error) {
      res.redirect(`/admin/booking/${id}`);
    }
  },
};
