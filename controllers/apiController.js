const Item = require("../models/Item");
const Activity = require("../models/Activity");
const Booking = require("../models/Booking");
const Category = require("../models/Category");
const Bank = require("../models/Bank");
const Member = require("../models/Member");
module.exports = {
  landingPage: async (req, res) => {
    try {
      const mostPicked = await Item.find()
        .select("_id title price city country unit imageId")
        .limit(5)
        .populate({ path: "imageId", select: "_id imageUrl" });

      const treasure = await Activity.find();
      const traveler = await Booking.find();
      const city = await Item.find();
      const categoryId = await Category.find()
        .select("_id name")
        .limit(3)
        .populate({
          path: "itemId",
          select: "_id title city country isPopular sumBooking",
          options: { sort: { sumBooking: -1 } },
          populate: {
            path: "imageId",
            select: "_id imageUrl",
            perDocumentLimit: 1,
          },
          perDocumentLimit: 4,
        });
      for (let i = 0, len = category.length; i < len; i++) {
        for (let j = 0, len = category[i].itemId.length; j < len; j++) {
          const item = await Item.findOne({ _id: category[i].itemId[j]._id });
          item.isPopular = false;
          await item.save();
          if (category[i].itemId[0] === category[i].itemId[j]) {
            item.isPopular = true;
            await item.save();
          }
        }
      }
      const testimonial = {
        _id: "asd1293uasdads1",
        imageUrl: "/images/testimonial_landingpage.jpg",
        name: "Happy Family",
        rate: 4.55,
        content:
          "What a great trip with my family and I should try again next time soon ...",
        familyName: "Angga",
        familyOccupation: "Product Designer",
      };
      res.status(200).json({
        hero: {
          travelers: traveler.length,
          treasures: treasure.length,
          cities: city.length,
        },
        mostPicked,
        categoryId,
        testimonial,
      });
    } catch (error) {}
  },
  detailPage: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Item.findOne({ _id: id })
        .select("_id title city country price unit description")
        .populate({
          path: "categoryId",
          select: "name",
          populate: {
            path: "itemId",
            select: "_id title country city isPopular sumBooking",
            options: { sort: { sumBooking: -1 } },
            populate: {
              path: "imageId",
              select: "_id imageUrl",
              perDocumentLimit: 1,
            },
            perDocumentLimit: 4,
          },
        })
        .populate({
          path: "featureId",
          select: "_id name qty imageUrl",
        })
        .populate({
          path: "activityId",
          select: "_id name type imageUrl",
        })
        .populate({
          path: "imageId",
          select: "_id imageUrl",
        });
      const bank = await Bank.find();
      const testimonial = {
        _id: "asd1293uasdads1",
        imageUrl: "/images/testimonial_landingpage.jpg",
        name: "Happy Family",
        rate: 4.55,
        content:
          "What a great trip with my family and I should try again next time soon ...",
        familyName: "Angga",
        familyOccupation: "Product Designer",
      };
      res.status(200).json({
        ...item._doc,
        bank,
        testimonial,
      });
    } catch (error) {}
  },
  bookingPage: async (req, res) => {
    const response = [];
    const {
      idItem,
      duration,
      price,
      bookingStartDate,
      bookingEndDate,
      firstName,
      lastName,
      email,
      phoneNumber,
      accountHolder,
      bankFrom,
    } = req.body;
    if (!req.file) {
      response.push("Image not found");
    }
    if (
      !idItem ||
      !duration ||
      !bookingStartDate ||
      !bookingEndDate ||
      !firstName ||
      !lastName ||
      !email ||
      !phoneNumber ||
      !accountHolder ||
      !bankFrom
    ) {
      response.push("Data belum lengkap");
    }
    const item = await Item.findOne({ _id: idItem });
    if (!item) {
      response.push("Item not found");
    }
    item.sumBooking += 1;
    await item.save();
    let total = item.price * duration;
    let tax = 0.11 * total;
    const invoice = Math.floor(1000000 + Math.random() * 9000000);
    const member = await Member.create({
      firstName,
      lastName,
      email,
      phoneNumber,
    });
    const newBooking = {
      invoice,
      bookingStartDate,
      bookingEndDate,
      total: total + tax,
      itemId: {
        _id: idItem,
        title: item.title,
        price: item.price,
        duration,
      },
      memberId: member.id,
      payments: {
        proofPayment: `image/${req.file.filename}`,
        bankFrom,
        accountHolder,
        status: "Proses",
      },
    };
    const booking = await Booking.create(newBooking);
    response.length > 0
      ? res.status(404).json(response.join(","))
      : res.status(201).json({
          message: "Sukses Booking",
          booking,
        });
  },
};
