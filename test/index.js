/**
 * Install Mocha globally so we can type "mocha.cmd" in terminal to test our api in test folder
 * require chai and chai-http
 * get chai.expect
 * get our app -> require('../app');
 * use our chaiHttp by chai -> chai.use(chaiHttp);
 */
const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
const app = require("../app");
const fs = require("fs");
chai.use(chaiHttp);

/**
 * Describe title and callback function
 */
describe("API ENDPOINT TESTING", () => {
  /**
   * it(title, callback function) => test function
   */
  it("Get Landing Page", (done) => {
    /**
     * request our app and get our api url
     */
    chai
      .request(app)
      .get("/api/v1/landing-page")
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("hero");
        expect(res.body.hero).to.have.all.keys(
          "travelers",
          "treasures",
          "cities"
        );
        expect(res.body).to.have.property("mostPicked");
        expect(res.body.mostPicked).to.have.an("array");
        expect(res.body).to.have.property("category");
        expect(res.body.category).to.have.an("array");
        expect(res.body).to.have.property("testimonial");
        expect(res.body.testimonial).to.have.an("object");
        done();
      });
  });

  it("Get Detail Page", (done) => {
    chai
      .request(app)
      .get("/api/v1/detail-page/5e96cbe292b97300fc902222")
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("categoryId");
        expect(res.body).to.have.property("imageId");
        expect(res.body).to.have.property("featureId");
        expect(res.body.featureId).to.have.an("array");
        expect(res.body).to.have.property("activityId");
        expect(res.body.activityId).to.have.an("array");
        expect(res.body).to.have.property("bank");
        expect(res.body.bank).to.have.an("array");
        expect(res.body).to.have.property("testimonial");
        expect(res.body.testimonial).to.be.an("object");
        done();
      });
  });
  it("Post Booking Page", (done) => {
    const image = __dirname + "/bukti.png";
    const dataSample = {
      image,
      idItem: "5e96cbe292b97300fc902222",
      duration: 2,
      price: "200",
      bookingStartDate: "25 June 2022",
      bookingEndDate: "27 June 2022",
      firstName: "Andrian",
      lastName: "Davinta",
      email: "andriandavinta@gmail.com",
      phoneNumber: "081363883325",
      accountHolder: "Andrian Davinta",
      bankFrom: "BCA",
    };
    chai
      .request(app)
      .post("/api/v1/booking-page")
      .set("Content-Type", "application/x-www-form-urlencoded")
      .field("idItem", dataSample.idItem)
      .field("duration", dataSample.duration)
      .field("price", dataSample.price)
      .field("bookingStartDate", dataSample.bookingStartDate)
      .field("bookingEndDate", dataSample.bookingEndDate)
      .field("firstName", dataSample.firstName)
      .field("lastName", dataSample.lastName)
      .field("email", dataSample.email)
      .field("phoneNumber", dataSample.phoneNumber)
      .field("accountHolder", dataSample.accountHolder)
      .field("bankFrom", dataSample.bankFrom)
      .attach("image",  fs.readFileSync(dataSample.image), "bukti.png")
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(201);
        expect(res.body).to.have.property("message");
        expect(res.body).to.have.property("booking");
        expect(res.body.message).to.equal("Sukses Booking");
        expect(res.body.booking).to.be.an("object");
        expect(res.body.booking).to.have.all.keys("invoice","bookingStartDate","bookingEndDate","itemId","total","memberId","payments","_id","__v");
        expect(res.body.booking.itemId).to.be.an("object");
        expect(res.body.booking.itemId).to.have.all.keys("_id","title","price","duration");
        expect(res.body.booking.payments).to.be.an("object");
        expect(res.body.booking.payments).to.have.all.keys("proofPayment","bankFrom","accountHolder","status")
        done()
      });
  });
});
