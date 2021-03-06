/* eslint-disable consistent-return */
/* eslint-disable class-methods-use-this */
import dotenv from 'dotenv';
import cloudinary from 'cloudinary';
import { House } from '../config/dbConfig';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

/**
 * @author Musindi KADHUWA
 * @description This class handles house operations
 */
class Houses {
  /**
   * @author Musindi KADHUWA
   * @description House creation
   * @param {object} req
   * @param {object} res
   */
  async postHouse(req, res) {
    const checkHouse = await House.findOne({ where: { houseNumber: req.body.houseNumber } });
    if (checkHouse) {
      return res.status(409).json({
        status: 409,
        error: 'House number already exist',
      });
    }
    const filename = req.files.images.path;
    cloudinary.v2.uploader.upload(filename, async (err, image) => {
      if (!err) {
        const imgURL = image.secure_url;
        const payload = req.body;
        payload.images = imgURL;
        const postedHouse = await House.create(payload);
        if (postedHouse) {
          res.status(201).json({
            status: 201,
            success: 'House successfully posted',
            data: postedHouse,
          });
        } else {
          res.status(500).json({
            status: 500,
            error: 'Server error',
          });
        }
      }
    });
  }

  /**
   * @author Raymond GAKWAYA
   * @description Get all available houses for sale
   * @param {object} req
   * @param {object} res
   */
  async getHouses(req, res) {
    try {
      const findHouse = await House.findAll();
      if (findHouse.length === 0) {
        res.status(404).json({
          status: 404,
          message: 'No houses found',
        });
        return;
      }
      res.status(200).json({
        status: 200,
        data: findHouse,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        error: `${error}`,
      });
    }
  }

  /**
   * @author Carlos Gringo
   * @description Specific house retrieval
   * @param {object} req
   * @param {object} res
   */
  async fetchId(req, res) {
    const houseId = parseInt(req.params.id, 10);
    const findHouse = await House.findOne({ where: { id: houseId } });
    if (findHouse) {
      res.status(200).json({
        status: 200,
        success: `House with id of ${houseId} Retrieved Successfully`,
        data: findHouse,
      });
    } else {
      res.status(404).json({
        status: 404,
        error: 'House with given Id not found!',
      });
    }
  }
}

export default Houses;
