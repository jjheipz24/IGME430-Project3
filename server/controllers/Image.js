// Import our Image model
const models = require('../models');
const Img = models.Images;

/* resuable image save helper function,
takes in data and returns the created model*/
const imageSaveHelper = (req, res, imgToSave) => {
  if (imgToSave.truncated) {
    return res.status(400).json({
      error: 'File is too large',
    });
  }

  // save info to image model
  const imgFile = {
    name: imgToSave.name,
    data: imgToSave.data,
    size: imgToSave.size,
    mimetype: imgToSave.mimetype,
    user: req.session.account._id,
  };

  // return the create image model
  const imageModel = new Img.ImgModel(imgFile);
  return imageModel;
};

/* Handles image upload via express-fileupload
Checks if files were sent, and makes sure they aren't too large

File data is then saved to the image schema and saved to the database
under the current logged in user
https://github.com/AustinWilloughby/SimpleNodeFileUpload*/
const uploadImage = (req, res) => {
  // hold all promises
  const promises = [];

  // If there are no files, return an error
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ error: 'No files were uploaded' });
  }

  if (Array.isArray(req.files.img)) {
    /* if multiple files are uploaded, this will run through each and save them */
    req.files.img.forEach(file => {
      promises.push(
        // Save the image to mongo
        imageSaveHelper(req, res, file).save()
      );
    });
  } else {
    // push single img upload to the promises array
    promises.push(
      imageSaveHelper(req, res, req.files.img).save()
    );
  }

  // return all promises at the same time
  return Promise.all(promises)
  // redirect after finished saving
  .then(() => {
    res.status(201).json({
      redirect: '/userPage',
    });
  })
  // If there is an error while saving, let the user know
  .catch((error) => {
    res.json({ error });
  });
};

/* Handles image retrieval

find the image via image name, then return it if
it is successfully found
https://github.com/AustinWilloughby/SimpleNodeFileUpload */
const retrieveImage = (req, res) => {
  Img.ImgModel.findOne({ name: req.query.name }, (error, doc) => {
    if (error) {
      return res.status(400).json({ error });
    }

    if (!doc) {
      return res.status(400).json({
        error: 'File not found',
      });
    }

    res.writeHead(200, {
      'Content-Type': doc.mimetype,
      'Content-Length': doc.size,
    });

    return res.end(doc.data);
  });
};

/* Get the csrfToken */
const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };
  res.json(csrfJSON);
};

/* Render the home page*/
const homePage = (req, res) => res.render('app');

/* Render the user page */
const userPage = (req, res) => res.render('user');


/* Find 36 random images (or as many as there are <36) and create
an array of their img paths. Then, split that array into 3 parts to pass
into the 3 columns in the view. Also, pass in the username and csrf token\

Also, ad placeholders are added on home page only
return a json of these images*/
const getHomeImg = (request, response) => {
  const res = response;

  return Img.ImgModel.findRandom((err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    const allImages = [];
    docs.forEach((doc) => {
      const imagePath = `./retrieve?name=${doc.name}`;
      allImages.push(imagePath);
    });

    // This inserts ads into the images array every 5 images
    for (let i = 0; i < allImages.length; i += 5) {
      allImages.splice(i, 0, './assets/img/ad.png');
    }

    const categories = [];

    // Split array
    // https://ourcodeworld.com/articles/read/278/how-to-split-an-array-into-chunks-of-the-same-size-easily-in-javascript
    for (let i = 0; i < allImages.length; i += allImages.length / 3) {
      categories.push(allImages.slice(i, i + allImages.length / 3));
    }

    return res.json({ imgs: categories });
  });
};

/* Find the images uploaded by the user and create
an array of their img paths. Then, split that array into 3 parts to pass
into the 3 columns in the view. Also, pass in the username and csrf token

return a json of these images*/
const getUserImg = (request, response) => {
  const res = response;
  const req = request;

  return Img.ImgModel.findByUser(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    const allImages = [];
    docs.forEach((doc) => {
      const imagePath = `./retrieve?name=${doc.name}`;
      allImages.push(imagePath);
    });

    const categories = [];

    // split array
    for (let i = 0; i < allImages.length; i += allImages.length / 3) {
      categories.push(allImages.slice(i, i + allImages.length / 3));
    }

    return res.json({ imgs: categories });
  });
};

/* grab the username of the current session account and pass it back in a json*/
const getUsername = (request, response) => {
  const req = request;
  const res = response;

  if (req.session.account) {
    return res.json({ username: req.session.account.username });
  }

  return res.json({ username: '' });
};

const clearAll = (req, res) => {
  Img.ImgModel.deleteByOwner(req.session.account._id, (err) => {
    if (err) {
      return res.status(400).json({
        error: 'An error occurred',
      });
    }

    return res.status(200).json({
      message: 'Success',
      redirect: '/userPage',
    });
  });
};

/* Exports */
module.exports.uploadImage = uploadImage;
module.exports.homePage = homePage;
module.exports.userPage = userPage;
module.exports.getToken = getToken;
module.exports.retrieve = retrieveImage;

module.exports.getHomeImg = getHomeImg;
module.exports.getUserImg = getUserImg;
module.exports.getUsername = getUsername;

module.exports.clearAll = clearAll;
